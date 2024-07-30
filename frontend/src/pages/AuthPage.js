import React, { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';


const AuthPage = () => {
    const [showRegister, setShowRegister] = useState(false);

    const toggleForm = () => {
      setShowRegister((prev) => !prev);
    };

  return (
    <div>
      {showRegister ? (
        <RegisterForm toggleForm={toggleForm} />
      ) : (
        <LoginForm toggleForm={toggleForm} />
      )}
    </div>
  );
};

export default AuthPage;
