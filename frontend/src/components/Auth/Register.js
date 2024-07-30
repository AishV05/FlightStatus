import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { register } from '../../api/auth';

const Register = () => {
    const [userData, setUserData] = useState({ username: '', email: '', password: '' });
    const history = useHistory();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await register(userData);
            history.push('/login');
        } catch (error) {
            console.error("Error registering:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input type="text" value={userData.username} onChange={(e) => setUserData({ ...userData, username: e.target.value })} required />
            </label>
            <label>
                Email:
                <input type="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} required />
            </label>
            <label>
                Password:
                <input type="password" value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} required />
            </label>
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;