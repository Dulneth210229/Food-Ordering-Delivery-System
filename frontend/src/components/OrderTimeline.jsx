// import React, { useEffect, useState } from 'react';
// import orderApi from '../services/orderApi';

// const OrderTimeline = ({ orderCode }) => {
//   const [timeline, setTimeline] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errorMsg, setErrorMsg] = useState('');

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const res = await orderApi.get(`/by-code/${orderCode}`);
//         console.log('ORDER FOUND:', res.data);
//         setTimeline(res.data.statusTimeline || []);
//         setLoading(false);
//       } catch (err) {
//         setErrorMsg('Order not found. Please check your code.');
//         setTimeline([]);
//         setLoading(false);
//       }
//     };

//     fetchOrder();
//   }, [orderCode]);

//   if (loading) return <p className="text-center mt-4">Loading timeline...</p>;
//   if (errorMsg) return <p className="text-center mt-4 text-red-600">{errorMsg}</p>;

//   return (
//     <div className="max-w-xl mx-auto mt-8 p-4 bg-white rounded shadow">
//       <h2 className="text-lg font-bold mb-4">Order Status Timeline</h2>
//       <ul className="space-y-3">
//         {timeline.map((entry, index) => (
//           <li key={index} className="flex items-start space-x-2">
//             <span>🔘</span>
//             <div>
//               <p className="font-medium">{entry.status}</p>
//               <p className="text-sm text-gray-600">
//                 {new Date(entry.timestamp).toLocaleString()}
//               </p>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default OrderTimeline;

import React, { useEffect, useState } from 'react';
import orderApi from '../services/orderApi';

const OrderTimeline = ({ orderCode }) => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [order, setOrder] = useState(null);

  // Status icons and colors mapping
  const statusConfig = {
    'PLACED': { 
      icon: '📝', 
      color: 'bg-blue-500',
      description: 'Your order has been received and is being processed'
    },
    'CONFIRMED': { 
      icon: '✅', 
      color: 'bg-green-500',
      description: 'Restaurant has confirmed your order'
    },
    'PREPARING': { 
      icon: '👨‍🍳', 
      color: 'bg-yellow-500',
      description: 'Your food is being prepared'
    },
    'READY_FOR_PICKUP': { 
      icon: '🍽️', 
      color: 'bg-purple-500',
      description: 'Your order is ready for pickup'
    },
    'OUT_FOR_DELIVERY': { 
      icon: '🚚', 
      color: 'bg-indigo-500',
      description: 'Your order is on the way'
    },
    'DELIVERED': { 
      icon: '🏠', 
      color: 'bg-emerald-500',
      description: 'Your order has been delivered'
    },
    'CANCELLED': { 
      icon: '❌', 
      color: 'bg-red-500',
      description: 'This order has been cancelled'
    },
    'PAYMENT_COMPLETE': { 
      icon: '💳', 
      color: 'bg-teal-500',
      description: 'Payment has been processed successfully'
    },
    // Default for any other status
    'DEFAULT': { 
      icon: '⏳', 
      color: 'bg-gray-500',
      description: 'Processing your order'
    }
  };

  const getStatusConfig = (status) => {
    return statusConfig[status] || statusConfig.DEFAULT;
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderApi.get(`/by-code/${orderCode}`);
        console.log('ORDER FOUND:', res.data);
        setOrder(res.data);
        setTimeline(res.data.statusTimeline || []);
        setLoading(false);
      } catch (err) {
        setErrorMsg('Order not found. Please check your code.');
        setTimeline([]);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderCode]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center h-48">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading order timeline...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-2xl mb-4">
            ⚠️
          </div>
          <h3 className="text-lg font-bold text-red-600 mb-2">Order Not Found</h3>
          <p className="text-gray-600">{errorMsg}</p>
        </div>
      </div>
    );
  }

  // Get current status
  const currentStatus = timeline.length > 0 ? timeline[timeline.length - 1].status : null;

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header with order info */}
      <div className="bg-gray-50 border-b p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Order #{orderCode}</h2>
            {order && (
              <p className="text-gray-600 mt-1">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}
          </div>
          {currentStatus && (
            <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusConfig(currentStatus).color}`}>
              {currentStatus.replace(/_/g, ' ')}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-bold mb-6 text-gray-800">Order Status Timeline</h3>
        
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute top-0 left-6 w-1 h-full bg-gray-200 rounded"></div>
          
          <ul className="space-y-8 relative">
            {timeline.map((entry, index) => {
              const { icon, color, description } = getStatusConfig(entry.status);
              const isLast = index === timeline.length - 1;
              
              return (
                <li key={index} className="flex items-start space-x-4">
                  {/* Timeline dot */}
                  <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shadow-md ${color}`}>
                    <span className="text-xl">{icon}</span>
                  </div>
                  
                  {/* Content */}
                  <div className={`flex-1 bg-white p-4 rounded-lg border ${isLast ? 'border-blue-200 shadow-sm' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-gray-800">
                        {entry.status.replace(/_/g, ' ')}
                      </h4>
                      <time className="text-sm text-gray-500">
                        {new Date(entry.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </time>
                    </div>
                    <p className="text-gray-600">{description}</p>
                    {entry.notes && (
                      <p className="mt-2 text-sm italic text-gray-500">{entry.notes}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        
        {timeline.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No status updates available for this order yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTimeline;