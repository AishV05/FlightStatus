import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel';
import Home from './pages/Home';
import PrivateRoute from './components/Auth/PrivateRoute';
import FlightList from './components/Dashboard/FlightList';
import Navbar from './components/Common/Navbar';
import { AuthProvider } from './context/AuthProvider';
import './App.css';
import AuthPage from './pages/AuthPage';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/register" element={<AuthPage />} />
                    <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
                    <Route path="/flights" element={<PrivateRoute><FlightList /></PrivateRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;


