import React, { useState } from "react";
import axios from "axios";

const AddProject = ({ onProjectAdded }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("pending");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post("/projects", { title, description, status }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("auth_token")}`
                }
            });

            onProjectAdded(response.data); // Update project list without refreshing
            setTitle("");
            setDescription("");
            setStatus("pending");
        } catch (err) {
            setError("Failed to add project. Please try again.");
            console.error("Error adding project:", err.response?.data || err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Project</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
            </select>
            <button type="submit">Add</button>
        </form>
    );
};

export default AddProject;
