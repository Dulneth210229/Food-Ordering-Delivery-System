import { createContext, useState, useEffect, useContext } from 'react';
import { 
  registerUser, registerAdmin, registerDriver, 
  loginUser, loginDriver, loginAdmin,
  getUserProfile, getDriverProfile, getAdminProfile,
  updateUserProfile, updateDriverProfile, updateAdminProfile,
  changeUserPassword, changeDriverPassword, changeAdminPassword,
  deleteUserAccount, deleteDriverAccount, deleteAdminAccount
} from '../api/auth';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch profile based on user type
  const fetchProfile = async (type) => {
    try {
      let response;
      switch(type) {
        case 'admin':
          response = await getAdminProfile();
          break;
        case 'driver':
          response = await getDriverProfile();
          break;
        default:
          response = await getUserProfile();
      }
      
      const userData = response.data;
      return userData.user;
    } catch (error) {
      console.error('Fetch profile error:', error);
      throw error;
    }
  };

  // Check for existing user in localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedUserType = localStorage.getItem('userType');
        
        if (token && storedUser && storedUserType) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setUserType(storedUserType);
            setIsAuthenticated(true);
            
            // Refresh user data from server to ensure it's current
            try {
              const currentUser = await fetchProfile(storedUserType);
              setUser(currentUser);
              localStorage.setItem('user', JSON.stringify(currentUser));
            } catch (error) {
              console.error('Failed to refresh user profile:', error);
              // If token is invalid or expired, logout
              if (error.response && error.response.status === 401) {
                logout();
              }
            }
          } catch (error) {
            console.error('Failed to parse user data:', error);
            // Clear corrupted data
            localStorage.removeItem('user');
            localStorage.removeItem('userType');
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const register = async (data, type) => {
    try {
      let response;
      switch(type) {
        case 'admin':
          response = await registerAdmin(data);
          break;
        case 'driver':
          response = await registerDriver(data);
          break;
        default:
          response = await registerUser(data);
      }
      
      toast.success('Registration successful!');
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const login = async (data, type = 'user') => {
    try {
      let response;
      switch(type) {
        case 'admin':
          response = await loginAdmin(data);
          break;
        case 'driver':
          response = await loginDriver(data);
          break;
        default:
          response = await loginUser(data);
      }
      
      const userData = response.data;
      
      // Store user data
      setUser(userData.user);
      setUserType(userData.userType || type);
      setIsAuthenticated(true);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData.user));
      localStorage.setItem('userType', userData.userType || type);
      localStorage.setItem('token', userData.token);
      
      toast.success('Login successful!');
      return userData;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateProfile = async (data) => {
    try {
      let response;
      switch(userType) {
        case 'admin':
          response = await updateAdminProfile(data);
          break;
        case 'driver':
          response = await updateDriverProfile(data);
          break;
        default:
          response = await updateUserProfile(data);
      }
      
      const updatedUser = response.data.user;
      
      // Update user data
      setUser(prevUser => ({ ...prevUser, ...updatedUser }));
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify({ ...user, ...updatedUser }));
      
      toast.success('Profile updated successfully!');
      return updatedUser;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const changePassword = async (data) => {
    try {
      switch(userType) {
        case 'admin':
          await changeAdminPassword(data);
          break;
        case 'driver':
          await changeDriverPassword(data);
          break;
        default:
          await changeUserPassword(data);
      }
      
      toast.success('Password changed successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      switch(userType) {
        case 'admin':
          await deleteAdminAccount();
          break;
        case 'driver':
          await deleteDriverAccount();
          break;
        default:
          await deleteUserAccount();
      }
      
      // Clear user data
      logout();
      
      toast.success('Account deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Account deletion failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userType, 
      isAuthenticated,
      register, 
      login,
      fetchProfile,
      updateProfile,
      changePassword,
      deleteAccount, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};