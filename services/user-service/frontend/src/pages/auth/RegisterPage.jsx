import { useState } from 'react';
import { Link } from 'react-router-dom';
import UserRegisterForm from '../../components/auth/UserRegisterForm';
import DriverRegisterForm from '../../components/auth/DriverRegisterForm';
import AdminRegisterForm from '../../components/auth/AdminRegisterForm';

const RegisterPage = () => {
  const [activeForm, setActiveForm] = useState('user');

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Create an Account</h1>
      
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`flex-1 py-4 px-2 text-center font-medium text-sm ${activeForm === 'user' 
            ? 'border-b-2 border-primary text-primary' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveForm('user')}
        >
          User
        </button>
        <button
          className={`flex-1 py-4 px-2 text-center font-medium text-sm ${activeForm === 'driver' 
            ? 'border-b-2 border-primary text-primary' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveForm('driver')}
        >
          Driver
        </button>
        <button
          className={`flex-1 py-4 px-2 text-center font-medium text-sm ${activeForm === 'admin' 
            ? 'border-b-2 border-primary text-primary' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveForm('admin')}
        >
          Admin
        </button>
      </div>

      <div className="min-h-[400px]">
        {activeForm === 'user' && <UserRegisterForm />}
        {activeForm === 'driver' && <DriverRegisterForm />}
        {activeForm === 'admin' && <AdminRegisterForm />}
      </div>

      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;