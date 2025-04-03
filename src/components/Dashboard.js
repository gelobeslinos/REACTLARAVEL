import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login", { replace: true });
    } else {
      fetchUser();
      fetchProjects();
    }
  }, [navigate]);

  const fetchUser = async () => {
    try {
      const response = await axios.get("/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get("/projects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` }
      });
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message
    try {
      const response = await axios.post(
        "/projects",
        { title, description, status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } }
      );

      setProjects([...projects, response.data]); // Update UI
      setTitle("");
      setDescription("");
      setStatus("pending");
    } catch (error) {
      console.error("Error adding project:", error);
      setError("Failed to add project. Please try again.");
    }
  };

  const handleEditProject = async (id, updatedTitle, updatedDescription, updatedStatus) => {
    try {
      await axios.put(
        `/projects/${id}`,
        { title: updatedTitle, description: updatedDescription, status: updatedStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } }
      );
      fetchProjects(); // Refresh list after editing
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` }
      });
      setProjects(projects.filter((project) => project.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Project Management Dashboard</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleAddProject} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit">Add Project</button>
      </form>

      <h3>My Projects</h3>
      <ul>
        {projects
          .filter((project) => project.user_id === user?.id)
          .map((project) => (
            <li key={project.id}>
              <strong>{project.title}</strong> - {project.status}
              <button onClick={() => handleEditProject(project.id, "Updated Title", "Updated Description", "in progress")}>
                Edit
              </button>
              <button onClick={() => handleDelete(project.id)}>Delete</button>
            </li>
        ))}
      </ul>

      <button onClick={handleLogout} style={{ marginTop: 20 }}>Logout</button>
    </div>
  );
}