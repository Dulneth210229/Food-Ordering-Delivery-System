// import React, { useEffect, useState } from 'react';
// import orderApi from '../services/orderApi';

// const OrderList = () => {
//   const [orders, setOrders] = useState([]);
//   const [refresh, setRefresh] = useState(false);

//   const fetchOrders = async () => {
//     try {
//       const res = await orderApi.get('/');
//       setOrders(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const cancelOrder = async (id) => {
//     const confirm = window.confirm('Are you sure you want to cancel this order?');
//     if (!confirm) return;

//     try {
//       await orderApi.put(`/cancel/${id}`);
//       setRefresh(!refresh); // trigger re-fetch
//     } catch (err) {
//       console.error(err);
//       alert('Cancel failed.');
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [refresh]);

//   return (
//     <div className="max-w-5xl mx-auto p-4 bg-white rounded shadow mt-10">
//       <h2 className="text-xl font-bold mb-4">All Orders</h2>
//       <div className="overflow-x-auto">
//         <table className="w-full text-left border-collapse">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="p-2">Order Code</th>
//               <th className="p-2">Customer</th>
//               <th className="p-2">Status</th>
//               <th className="p-2">Amount (LKR)</th>
//               <th className="p-2">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map(order => (
//               <tr key={order._id} className="border-t">
//                 <td className="p-2 font-mono">{order.orderCode}</td>
//                 <td className="p-2">{order.customerId}</td>
//                 <td className="p-2">
//                   <span className={`px-2 py-1 rounded text-white text-sm ${
//                     order.status === 'Pending' ? 'bg-yellow-500' :
//                     order.status === 'Cancelled' ? 'bg-red-500' :
//                     'bg-green-600'
//                   }`}>
//                     {order.status}
//                   </span>
//                 </td>
//                 <td className="p-2">{order.totalAmount}</td>
//                 <td className="p-2">
//                   {order.status === 'Pending' ? (
//                     <button
//                       onClick={() => cancelOrder(order._id)}
//                       className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
//                     >
//                       Cancel
//                     </button>
//                   ) : (
//                     <span className="text-gray-400 italic">No Action</span>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default OrderList;

import React, { useEffect, useState } from 'react';
import orderApi from '../services/orderApi';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.get('/');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id, orderCode) => {
    try {
      await orderApi.put(`/cancel/${id}`);
      setRefresh(!refresh); // trigger re-fetch
    } catch (err) {
      console.error(err);
      alert('Cancel failed.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refresh]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', { 
      style: 'currency', 
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      'PLACED': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Placed' },
      'CONFIRMED': { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Confirmed' },
      'PREPARING': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Preparing' },
      'READY_FOR_PICKUP': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Ready for Pickup' },
      'OUT_FOR_DELIVERY': { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Out for Delivery' },
      'DELIVERED': { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
      'CANCELLED': { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
      'Pending': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Pending' },
      'default': { bg: 'bg-gray-100', text: 'text-gray-800', label: status }
    };
    
    return statusConfig[status] || statusConfig.default;
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    return (
      (order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.customerId?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === '' || order.status === filterStatus)
    );
  });

  // Get all unique statuses
  const statusOptions = [...new Set(orders.map(order => order.status))];

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden my-8">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          
          <select
            className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => {
              setRefresh(!refresh);
              setSearchTerm('');
              setFilterStatus('');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredOrders.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map(order => {
                const statusBadge = getStatusBadge(order.status);
                
                return (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{order.orderCode}</span>
                        <span className="text-sm text-gray-500">
                          {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{order.customerId}</span>
                        <span className="text-sm text-gray-500">
                          {order.restaurantId && `Restaurant: ${order.restaurantId}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <a 
                          href={`/order/track/${order.orderCode}`}
                          className="text-blue-600 hover:text-blue-900 font-medium flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                          View
                        </a>
                        
                        {(order.status === 'Pending' || order.status === 'PLACED') && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to cancel order ${order.orderCode}?`)) {
                                cancelOrder(order._id, order.orderCode);
                              }
                            }}
                            className="text-red-600 hover:text-red-900 font-medium flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>
    </div>
  );
};

export default OrderList;
