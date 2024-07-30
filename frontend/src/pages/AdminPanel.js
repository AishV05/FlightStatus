// src/pages/AdminPanel.js
import React from 'react';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import Navbar from '../components/Common/Navbar';

const AdminPanel = () => {
    return (
        <div>
            <Navbar/>
            <h1>Admin Panel</h1>
            <AdminDashboard />
        </div>
    );
};

export default AdminPanel;
