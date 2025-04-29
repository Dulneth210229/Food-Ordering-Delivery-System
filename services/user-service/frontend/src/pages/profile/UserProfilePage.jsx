import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from 'react-hot-toast';

const UserProfilePage = () => {
  const { user, userType, isAuthenticated, loading, updateProfile, changePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  // States for various forms
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: userType !== 'driver' ? '' : undefined, // Exclude username for drivers
    phone: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteIntent, setDeleteIntent] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Populate profile data when user data is available
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        username: userType !== 'driver' ? user.username || '' : undefined, // Exclude username for drivers
        phone: user.phone || ''
      });
    }
  }, [user, userType]); // Add userType as a dependency to re-run when it changes

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDeleteIntentChange = (e) => {
    setDeleteIntent(e.target.value);
    if (errors.deleteIntent) {
      setErrors(prev => ({ ...prev, deleteIntent: '' }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};
    
    // First Name validation
    if (!profileData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (profileData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    } else if (profileData.firstName.length > 50) {
      newErrors.firstName = "First name cannot exceed 50 characters";
    } else if (!/^[A-Za-z\s-]+$/.test(profileData.firstName)) {
      newErrors.firstName = "First name can only contain letters, spaces, and hyphens";
    }
    
    // Last Name/Location validation
    if (!profileData.lastName.trim()) {
      newErrors.lastName = userType === 'driver' ? "Location is required" : "Last name is required";
    } else if (profileData.lastName.length < 2) {
      newErrors.lastName = userType === 'driver' ? "Location must be at least 2 characters" : "Last name must be at least 2 characters";
    } else if (profileData.lastName.length > 50) {
      newErrors.lastName = userType === 'driver' ? "Location cannot exceed 50 characters" : "Last name cannot exceed 50 characters";
    } else if (!/^[A-Za-z\s-]+$/.test(profileData.lastName)) {
      newErrors.lastName = userType === 'driver' ? "Location can only contain letters, spaces, and hyphens" : "Last name can only contain letters, spaces, and hyphens";
    }
    
    // Email validation
    if (!profileData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (profileData.email.length > 100) {
      newErrors.email = "Email cannot exceed 100 characters";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(profileData.email)) {
      newErrors.email = "Email address is invalid";
    }
    
    // Username validation (for non-drivers)
    if (userType !== 'driver') {
      if (!profileData.username?.trim()) {
        newErrors.username = "Username is required";
      } else if (profileData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      } else if (profileData.username.length > 20) {
        newErrors.username = "Username cannot exceed 20 characters";
      } else if (!/^[a-zA-Z0-9_]+$/.test(profileData.username)) {
        newErrors.username = "Username can only contain letters, numbers, and underscores";
      }
    }
    
    // Phone validation (for drivers)
    if (userType === 'driver') {
      if (!profileData.phone.trim()) {
        newErrors.phone = "Phone number is required for drivers";
      } else if (!/^\d{10}$/.test(profileData.phone.trim())) {
        newErrors.phone = "Phone number must be exactly 10 digits";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    // Current Password validation
    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    } else if (passwordData.currentPassword.length < 6) {
      newErrors.currentPassword = "Current password must be at least 6 characters";
    } else if (passwordData.currentPassword.length > 50) {
      newErrors.currentPassword = "Current password cannot exceed 50 characters";
    }
    
    // New Password validation
    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "New password must be at least 8 characters";
    } else if (passwordData.newPassword.length > 50) {
      newErrors.newPassword = "New password cannot exceed 50 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(passwordData.newPassword)) {
      newErrors.newPassword = "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    } else if (passwordData.newPassword === passwordData.currentPassword) {
      newErrors.newPassword = "New password must be different from the current password";
    }
    
    // Confirm Password validation
    if (passwordData.newPassword && passwordData.confirmPassword !== passwordData.newPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDeleteForm = () => {
    const newErrors = {};
    
    if (deleteConfirmation.trim() !== user?.email) {
      newErrors.deleteConfirmation = "Email doesn't match";
    }
    
    if (deleteIntent.trim() !== 'DELETE') {
      newErrors.deleteIntent = "Please type 'DELETE' to confirm";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;
    
    setIsUpdating(true);
    try {
      await updateProfile(profileData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Update profile error:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        toast.error('Failed to update profile. Please try again.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setIsChangingPassword(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      toast.success('Password changed successfully!');
    } catch (error) {
      console.error('Change password error:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        toast.error('Failed to change password. Please try again.');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!validateDeleteForm()) return;
    
    setIsDeleting(true);
    try {
      await deleteAccount();
      navigate('/');
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'profile' 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Information
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'security' 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('security')}
        >
          Password & Security
        </button>
        
        {/* Only show Delete Account tab for non-admin users */}
        {userType !== 'admin' && (
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'danger' 
                ? 'border-b-2 border-danger text-danger' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('danger')}
          >
            Delete Account
          </button>
        )}
      </div>
      
      {/* Profile Tab Content */}
      {activeTab === 'profile' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Edit Profile Information</h2>
          
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
              {errors.general}
            </div>
          )}
          
          <form onSubmit={handleUpdateProfile}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={profileData.firstName}
                onChange={handleProfileChange}
                error={errors.firstName}
                placeholder="John"
                required
              />
              <Input
                label={userType === 'driver' ? "Location" : "Last Name"}
                name="lastName"
                value={profileData.lastName}
                onChange={handleProfileChange}
                error={errors.lastName}
                placeholder={userType === 'driver' ? "City, State" : "Doe"}
                required
              />
            </div>
            
            {userType !== 'driver' && ( // Conditionally render username field for non-drivers
              <Input
                label="Username"
                name="username"
                value={profileData.username}
                onChange={handleProfileChange}
                error={errors.username}
                placeholder="johndoe"
                required
              />
            )}
            <Input
              label="Email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleProfileChange}
              error={errors.email}
              placeholder="john.doe@example.com"
              required
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Account Type</label>
              <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                {userType === 'admin' ? 'Administrator' : userType === 'driver' ? 'Driver' : 'User'}
              </div>
            </div>
            
            {userType === 'driver' && (
              <Input
                label="Phone"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                error={errors.phone}
                placeholder="1234567890"
                required
              />
            )}
            
            <Button type="submit" disabled={isUpdating} className="mt-4">
              {isUpdating ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </div>
      )}
      
      {/* Security Tab Content */}
      {activeTab === 'security' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Change Password</h2>
          
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
              {errors.general}
            </div>
          )}
          
          <form onSubmit={handleChangePassword}>
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              error={errors.currentPassword}
              placeholder="Enter your current password"
              required
            />
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              error={errors.newPassword}
              placeholder="Enter new password"
              required
            />
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              error={errors.confirmPassword}
              placeholder="Confirm new password"
              required
            />
            
            <Button type="submit" disabled={isChangingPassword} className="mt-4">
              {isChangingPassword ? 'Changing Password...' : 'Change Password'}
            </Button>
          </form>
        </div>
      )}
      
      {/* Danger Zone Tab Content - Only for non-admin users */}
      {activeTab === 'danger' && userType !== 'admin' && (
        <div className="bg-white shadow rounded-lg p-6 border-t-4 border-danger">
          <h2 className="text-lg font-medium mb-2 text-danger">Delete Account</h2>
          <p className="text-gray-600 mb-4">
            This action cannot be undone. Once you delete your account, all of your data will be permanently removed.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
            <p className="text-sm text-red-600">
              To confirm deletion, please enter your email address: <strong>{user?.

email}</strong>
            </p>
            <Input
              name="deleteConfirmation"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              error={errors.deleteConfirmation}
              placeholder="Enter your email to confirm"
              className="mt-2"
            />
            <p className="text-sm text-red-600 mt-2">
              Type <strong>DELETE</strong> to confirm your intent to delete your account.
            </p>
            <Input
              name="deleteIntent"
              value={deleteIntent}
              onChange={handleDeleteIntentChange}
              error={errors.deleteIntent}
              placeholder="Type DELETE to confirm"
              className="mt-2"
            />
            <Button 
              variant="danger" 
              disabled={isDeleting || deleteConfirmation.trim() !== user?.email || deleteIntent.trim() !== 'DELETE'} 
              onClick={handleDeleteAccount}
              className="mt-2"
            >
              {isDeleting ? 'Deleting...' : 'Permanently Delete Account'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;