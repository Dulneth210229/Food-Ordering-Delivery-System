// 
import React from 'react';
import OrderForm from './components/OrderForm';
import OrderTracker from './pages/OrderTracker';
import OrderList from './components/OrderList';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-10">
      <OrderForm />
      <OrderTracker />
      <OrderList />
    </div>
  );
}

export default App;
