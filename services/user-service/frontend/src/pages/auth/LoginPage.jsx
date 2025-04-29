import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [userType, setUserType] = useState('user');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Check for userType in URL params when component mounts
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type && ['user', 'driver', 'admin'].includes(type)) {
      setUserType(type);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await login(formData, userType);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Login to Your Account</h1>
      
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
          {errors.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* User Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Login as
          </label>
          <div className="flex border-b border-gray-200 mb-4">
            <button
              type="button"
              className={`flex-1 py-2 px-2 text-center font-medium text-sm ${
                userType === 'user' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setUserType('user')}
            >
              User
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-2 text-center font-medium text-sm ${
                userType === 'driver' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setUserType('driver')}
            >
              Driver
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-2 text-center font-medium text-sm ${
                userType === 'admin' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setUserType('admin')}
            >
              Admin
            </button>
          </div>
        </div>
        
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Enter your email"
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter your password"
          required
        />
        
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary-dark border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="font-medium text-primary hover:text-primary-dark">
              Forgot your password?
            </a>
          </div>
        </div>
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
          Register now
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;