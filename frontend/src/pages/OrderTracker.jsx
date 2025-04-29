import React, { useState } from 'react';
import OrderTimeline from '../components/OrderTimeline';

const OrderTracker = () => {
  const [orderCode, setOrderCode] = useState('');
  const [submittedCode, setSubmittedCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedCode(orderCode); // ✅ this triggers OrderTimeline
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-4 shadow rounded mb-6">
        <h2 className="text-lg font-bold mb-2">Track Your Order</h2>
        <input
          type="text"
          placeholder="Enter Order Code"
          value={orderCode}
          onChange={(e) => setOrderCode(e.target.value)}
          className="w-full border p-2 rounded mb-2"
          required
        />
        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">
          View Timeline
        </button>
      </form>

      {/* ✅ Conditionally render OrderTimeline if submitted */}
      {submittedCode && <OrderTimeline orderCode={submittedCode} />}
    </div>
  );
};

export default OrderTracker;
