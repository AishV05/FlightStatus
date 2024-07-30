import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const fetchUser = async () => {
                try {
                    const response = await axios.get(`${API_URL}/auth/user`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                    localStorage.removeItem('access_token');
                    setUser(null);
                }
            };

            fetchUser();
        }
    }, []);

    const login = async (username, password) => {
        //const navigate = useNavigate();
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { username, password });
            const { access_token } = response.data;
            localStorage.setItem('access_token', access_token);

            const userResponse = await axios.get(`${API_URL}/auth/user`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });
            setUser(userResponse.data);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider };
