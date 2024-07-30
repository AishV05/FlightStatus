import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';

const RegisterForm = ({toggleForm}) => {
    const [userData, setUserData] = useState({ username: '', email: '', password: '', phone_number :'' });
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await register(userData);
            navigate('/login');
            toggleForm()
        } catch (error) {
            console.error("Error registering:", error);
        }
    };

    return (
        <div class="flex items-center justify-center min-h-screen bg-gray-100">
  <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
    <h2 class="text-center text-2xl font-bold">Register</h2>
    <form onSubmit={handleSubmit}>
      <div>
        <label class="block mb-1 pt-4 text-sm font-medium text-gray-700" for="username">Username</label>
        <input type="text" value={userData.username} onChange={(e) => setUserData({ ...userData, username: e.target.value })} required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your username" />

      </div>
      <div>
        <label class="block mb-1 pt-4 text-sm font-medium text-gray-700" for="email">Email</label>
        <input type="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your email" />
      </div>
      <div>
        <label class="block mb-1 pt-4 text-sm font-medium text-gray-700" for="phone_number">Phone Number</label>
        <input type="text" value={userData.phone_number} onChange={(e) => setUserData({ ...userData, phone_number: e.target.value })} required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your phone number" />
      </div>
      <div>
        <label class="block mb-1 pt-4 text-sm font-medium text-gray-700" for="password">Password</label>
        <input type="password" value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your password" />
      </div>
      
      <button type="submit" class="w-full px-4 mt-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Register</button>
    </form>
    <p class="text-sm text-center">
      Already have an account? 
      <a href="#" class="text-blue-600 hover:underline" onClick={toggleForm}> Login here</a>
    </p>
  </div>
</div>

       
    );
};

export default RegisterForm;