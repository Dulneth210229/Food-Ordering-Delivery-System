import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


const DashboardPage = () => {
  const { user, userType, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const renderDashboard = () => {
    switch (userType) {
      case 'admin':
        return <AdminDashboard user={user} />;
      case 'driver':
        return <DriverDashboard user={user} />;
      default:
        return <UserDashboard user={user} />;
    }
  };

      

  const UserDashboard = ({ user }) => (
    <div>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome back, {user?.firstName}!</h2>
        <p className="text-gray-600">Start exploring restaurants and ordering your favorite food.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Your Recent Orders</h3>
          <div className="text-sm text-gray-500">
            You don't have any recent orders yet. Start ordering now!
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Favorite Restaurants</h3>
          <div className="text-sm text-gray-500">
            You haven't added any restaurants to your favorites yet.
          </div>
        </div>
      </div>
    </div>
  );

  const DriverDashboard = ({ user }) => (
    <div>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Driver Dashboard</h2>
        <p className="text-gray-600">Welcome back, {user?.firstName}. Here's your delivery summary.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Today's Deliveries</h3>
          <div className="text-3xl font-bold text-primary">0</div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Total Earnings</h3>
          <div className="text-3xl font-bold text-primary">$0.00</div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Rating</h3>
          <div className="text-3xl font-bold text-primary">N/A</div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Available Orders</h3>
        <div className="text-sm text-gray-500">
          No available orders at the moment. Please check back later.
        </div>
      </div>
    </div>
  );

  const AdminDashboard = ({ user }) => (
    <div>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin Dashboard</h2>
        <p className="text-gray-600">Welcome back, {user?.firstName}. Here's your platform overview.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Users</h3>
          <div className="text-3xl font-bold text-primary">0</div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Orders</h3>
          <div className="text-3xl font-bold text-primary">0</div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Drivers</h3>
          <div className="text-3xl font-bold text-primary">0</div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Restaurants</h3>
          <div className="text-3xl font-bold text-primary">0</div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h3>
        <div className="text-sm text-gray-500">
          No recent activity to display.
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;
  