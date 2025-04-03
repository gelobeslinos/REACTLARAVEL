import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // For navigation

const ProjectList = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/projects").then((res) => {
            setProjects(res.data);
        });
    }, []);

    return (
        <div>
            <h2>Projects</h2>
            <button onClick={() => window.location.href = "/add-project"}>Add Project</button>
            <table border="1">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <td>{project.title}</td>
                            <td>{project.description}</td>
                            <td>{project.status}</td>
                            <td>{new Date(project.created_at).toLocaleString()}</td>
                            <td>{new Date(project.updated_at).toLocaleString()}</td>
                            <td>
                                <Link to={`/edit-project/${project.id}`}>
                                    <button>Edit</button>
                                </Link>
                                <button onClick={() => deleteProject(project.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const deleteProject = async (id) => {
    if (window.confirm("Are you sure?")) {
        await axios.delete(`http://127.0.0.1:8000/api/projects/${id}`);
        window.location.reload();
    }
};

export default ProjectList;
