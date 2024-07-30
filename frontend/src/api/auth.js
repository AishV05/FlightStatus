import axios from 'axios';
import qs from 'qs';  

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, qs.stringify({
            username,
            password
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'  // URL-encoded content type
            }
        });
        // Store the access token in local storage
        localStorage.setItem('access_token', response.data.access_token);
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const register = async (userData) => {
    try {
        console.log(userData)
        const response = await axios.post(`${API_URL}/auth/register`, JSON.stringify(userData), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Registration error:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getCurrentUser = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/auth/user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Get current user error:', error.response ? error.response.data : error.message);
        throw error;
    }
};
