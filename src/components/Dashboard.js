import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import "../components/Dashboard.css"; // Make sure to create this CSS file

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [editProject, setEditProject] = useState(null);

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
        headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get("/projects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
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
    setError("");
    try {
      const response = await axios.post(
        "/projects",
        { title, description, status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } }
      );

      setProjects([...projects, response.data]);
      setTitle("");
      setDescription("");
      setStatus("pending");
    } catch (error) {
      console.error("Error adding project:", error);
      setError("Failed to add project. Please try again.");
    }
  };

  const handleEdit = (project) => {
    setEditProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setStatus(project.status);
  };

  const handleUpdateProject = async () => {
    if (!editProject) return;
    try {
      await axios.put(
        `/projects/${editProject.id}`,
        { title, description, status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } }
      );

      setProjects(
        projects.map((proj) =>
          proj.id === editProject.id ? { ...proj, title, description, status } : proj
        )
      );

      setEditProject(null);
      setTitle("");
      setDescription("");
      setStatus("pending");
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
      });
      setProjects(projects.filter((project) => project.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      <h2>Project Management Dashboard</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="form-container">
        <h3>{editProject ? "Edit Project" : "Add Project"}</h3>
        <form onSubmit={editProject ? handleUpdateProject : handleAddProject}>
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
          <button type="submit">{editProject ? "Update Project" : "Add Project"}</button>
        </form>
      </div>

      <h3>My Projects</h3>
      <div className="projects-container">
        {projects
          .filter((project) => project.user_id === user?.id)
          .map((project) => (
            <div className="project-card" key={project.id}>
              <strong>{project.title}</strong>
              <p className={`status ${project.status.replace(" ", "-")}`}>{project.status}</p>
              <p>{project.description}</p>
              <button className="edit-button" onClick={() => handleEdit(project)}>
                Edit
              </button>
              <button className="delete-button" onClick={() => handleDelete(project.id)}>
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
