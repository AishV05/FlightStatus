// src/components/Auth/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import useAuth from '../../hooks/useAuth';

const LoginForm = ({toggleForm}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const userData = await login(username, password);
            // authLogin(userData);
            navigate('/');
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    return (
      <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="w-full max-w-md p-8 space-y-3 bg-white rounded-lg shadow-md">
        <h2 class="text-center text-2xl font-bold">Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label class="block mb-1 pt-4 text-sm font-medium text-gray-700" for="username">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required  class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your email/username" />
          </div>
          <div>
            <label class="block mb-1 pt-4 text-sm font-medium text-gray-700" for="password">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your password" />
          </div>
          <button type="submit" class="w-full px-4 mt-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Log In</button>
        </form>
        <p class="text-sm text-center">
        </p>
        <p class="text-sm text-center">
          Don't have an account? 
          {/* <Register/> */}
          <a href="#" class="text-blue-600 hover:underline" onClick={toggleForm}> Register here</a>
        </p>
      </div>
    </div>

        // <form >
        //     <label>
        //         Username:
        //         <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        //     </label>
        //     <label>
        //         Password:
        //         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        //     </label>
        //     <button type="submit">Login</button>
        // </form>
    );
};

export default LoginForm;




