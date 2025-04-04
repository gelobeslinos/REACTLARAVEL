import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchProject = useCallback(async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
    } catch (error) {
      console.error('Failed to load project:', error);
      setMessage({ text: 'Failed to load project', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      await api.put(`/projects/${id}`, project);
      setMessage({ text: 'Project updated successfully!', type: 'success' });
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Failed to update project:', error);
      setMessage({ text: 'Failed to update project', type: 'error' });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!project) return <p>Project not found</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Edit Project</h2>
      {message.text && (
        <p className={`p-2 mb-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message.text}</p>
      )}
      <form onSubmit={handleSave}>
        <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={project.title}
          onChange={(e) => setProject({ ...project, title: e.target.value })}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={project.description}
          onChange={(e) => setProject({ ...project, description: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Save Changes</button>
        <button type="button" onClick={() => navigate('/')} className="ml-2 text-gray-600">Cancel</button>
      </form>
    </div>
  );
}
