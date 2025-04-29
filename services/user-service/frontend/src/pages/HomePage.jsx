import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Welcome to Food Delivery
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          Order food from your favorite restaurants and have it delivered right to your door.
        </p>
        
        <div className="mt-8 flex justify-center">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <button className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark">
                Go to Dashboard
              </button>
            </Link>
          ) : (
            <div className="space-x-4">
              <Link to="/login">
                <button className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 border-primary">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark">
                  Register Now
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Features section */}
      <div className="mt-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow">
            <div className="p-3 bg-primary-dark bg-opacity-10 rounded-full">
              <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Fast Delivery</h3>
            <p className="mt-2 text-base text-gray-500 text-center">
              Get your food delivered quickly and efficiently.
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow">
            <div className="p-3 bg-primary-dark bg-opacity-10 rounded-full">
              <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Wide Selection</h3>
            <p className="mt-2 text-base text-gray-500 text-center">
              Choose from a wide variety of restaurants and cuisines.
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow">
            <div className="p-3 bg-primary-dark bg-opacity-10 rounded-full">
              <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Easy Tracking</h3>
            <p className="mt-2 text-base text-gray-500 text-center">
              Track your order in real-time until it arrives at your doorstep.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;