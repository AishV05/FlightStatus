// src/pages/Dashboard.js
import React from 'react';
import useAuth from '../hooks/useAuth';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import UserDashboard from '../components/Dashboard/UserDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (user && user.is_admin) {
        return <AdminDashboard />;
    }
    return <UserDashboard />;
};

export default Dashboard;
