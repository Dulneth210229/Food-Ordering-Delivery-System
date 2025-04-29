import React, { useState } from 'react';
import orderApi from '../services/orderApi';

const OrderForm = () => {
  const [orderData, setOrderData] = useState({
    customerId: '',
    restaurantId: '',
    totalAmount: 0,
    items: [{ itemId: '', name: '', quantity: 1, price: 0 }]
  });

  const [submittedOrder, setSubmittedOrder] = useState(null);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...orderData.items];
    updatedItems[index][field] = value;
    setOrderData({ ...orderData, items: updatedItems });
  };

  const addItem = () => {
    setOrderData({
      ...orderData,
      items: [...orderData.items, { itemId: '', name: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index) => {
    if (orderData.items.length > 1) {
      const updatedItems = orderData.items.filter((_, i) => i !== index);
      setOrderData({ ...orderData, items: updatedItems });
    }
  };

  const calculateTotal = () => {
    return orderData.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const total = orderData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    try {
      const res = await orderApi.post('/', { ...orderData, totalAmount: total });
      setSubmittedOrder(res.data);
      setOrderData({
        customerId: '',
        restaurantId: '',
        totalAmount: 0,
        items: [{ itemId: '', name: '', quantity: 1, price: 0 }]
      });
    } catch (err) {
      console.error(err);
      alert('Order creation failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Create New Order</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Customer ID</label>
            <input
              type="text"
              value={orderData.customerId}
              onChange={(e) => setOrderData({ ...orderData, customerId: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Restaurant ID</label>
            <input
              type="text"
              value={orderData.restaurantId}
              onChange={(e) => setOrderData({ ...orderData, restaurantId: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg text-gray-800">Order Items</h3>
            <div className="text-right">
              <span className="text-gray-700 font-medium mr-2">Total: LKR {calculateTotal()}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {orderData.items.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Item #{index + 1}</h4>
                  {orderData.items.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 focus:outline-none transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Item ID</label>
                    <input
                      type="text"
                      value={item.itemId}
                      onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Name</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Price (LKR)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                      className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="mt-2 text-sm text-right font-medium text-gray-700">
                  Item Subtotal: LKR {(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button" 
            onClick={addItem} 
            className="mt-4 flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium text-sm transition-colors"
          >
            <span className="mr-1">+</span> Add Another Item
          </button>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white font-medium px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
        >
          Submit Order
        </button>
      </form>

      {submittedOrder && (
        <div className="mt-8 bg-green-50 p-6 rounded-lg border-l-4 border-green-500 shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-green-800">Order Confirmed</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Order Code</p>
              <p className="font-semibold">{submittedOrder.orderCode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer ID</p>
              <p className="font-semibold">{submittedOrder.customerId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Restaurant</p>
              <p className="font-semibold">{submittedOrder.restaurantId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-semibold flex items-center">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                {submittedOrder.status} • {submittedOrder.paymentStatus}
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-semibold text-gray-700 mb-2">Items</h4>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Item</th>
                    <th className="px-4 py-2 text-center text-gray-500 font-medium">Qty</th>
                    <th className="px-4 py-2 text-right text-gray-500 font-medium">Price</th>
                    <th className="px-4 py-2 text-right text-gray-500 font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {submittedOrder.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-800">{item.name}</td>
                      <td className="px-4 py-3 text-center text-gray-800">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-800">LKR {item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-800">
                        LKR {(item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right font-semibold">Total Amount</td>
                    <td className="px-4 py-3 text-right font-bold text-blue-600">
                      LKR {submittedOrder.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <button
            onClick={() => window.location.href = `http://localhost:5174/payment/${submittedOrder.orderCode}`}
            className="mt-6 w-full bg-green-600 text-white font-medium px-6 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all flex justify-center items-center"
          >
            Proceed to Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderForm;