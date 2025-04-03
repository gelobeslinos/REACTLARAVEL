import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AddProject from './components/AddProject';
import EditProject from './components/EditProject';
import ProjectList from './components/ProjectList';

function PrivateRoute({ children }) {
  const location = useLocation();
  const authToken = localStorage.getItem('auth_token');
  
  return authToken ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/add-project" element={<PrivateRoute><AddProject /></PrivateRoute>} />
        <Route path="/edit-project/:id" element={<PrivateRoute><EditProject /></PrivateRoute>} />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Project List (not protected) */}
        <Route path="/project-list" element={<ProjectList />} />
      </Routes>
    </Router>
  );
}

export default App;
