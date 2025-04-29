import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './store/slices/authSlice';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RestaurantList from './pages/restaurants/RestaurantList';
import RestaurantDetail from './pages/restaurants/RestaurantDetail';
import RestaurantForm from './pages/restaurants/RestaurantForm';
// import MenuForm from './pages/restaurants/MenuForm';
// import OrderList from './pages/orders/OrderList';
// import OrderDetail from './pages/orders/OrderDetail';
// import Profile from './pages/profile/Profile';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/restaurants/new" element={<RestaurantForm />} />
              <Route path="/restaurants/:id/edit" element={<RestaurantForm />} />
              {/* <Route path="/restaurants/:id/menu" element={<MenuForm />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/profile" element={<Profile />} /> */}
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 