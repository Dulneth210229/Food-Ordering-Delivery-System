import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantById } from '../../store/slices/restaurantSlice';
import { createOrder } from '../../store/slices/orderSlice';

const RestaurantDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentRestaurant: restaurant, loading } = useSelector((state) => state.restaurants);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [selectedItems, setSelectedItems] = useState([]);
  const [orderStatus, setOrderStatus] = useState('idle');

  useEffect(() => {
    dispatch(fetchRestaurantById(id));
  }, [dispatch, id]);

  const handleAddToOrder = (item) => {
    setSelectedItems((prev) => {
      const existingItem = prev.find((i) => i._id === item._id);
      if (existingItem) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveFromOrder = (itemId) => {
    setSelectedItems((prev) => prev.filter((item) => item._id !== itemId));
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setSelectedItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }

    const orderData = {
      restaurant: id,
      items: selectedItems.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: selectedItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
      paymentMethod: 'credit_card', // This should come from a form
      deliveryAddress: {
        // This should come from user's profile or form
        street: '123 Main St',
        city: 'City',
        state: 'State',
        zipCode: '12345',
        country: 'Country'
      }
    };

    try {
      setOrderStatus('loading');
      await dispatch(createOrder(orderData)).unwrap();
      setSelectedItems([]);
      setOrderStatus('success');
    } catch (error) {
      setOrderStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Restaurant not found.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Restaurant Header */}
      <div className="relative h-64 mb-8">
        {restaurant.images && restaurant.images[0] && (
          <img
            src={restaurant.images[0]}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
            <div className="flex items-center text-white">
              <span className="mr-4">{restaurant.priceRange}</span>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span>{restaurant.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Restaurant Info */}
          <div className="lg:col-span-2">
            <div className="card mb-8">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-600 mb-4">{restaurant.description}</p>
              
              <h3 className="text-xl font-semibold mb-2">Cuisine</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {restaurant.cuisine.map((type) => (
                  <span
                    key={type}
                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                  >
                    {type}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-semibold mb-2">Opening Hours</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(restaurant.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize">{day}</span>
                    <span>{hours.open} - {hours.close}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Menu Section */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Menu</h2>
              <div className="space-y-6">
                {restaurant.menu?.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-600">{item.description}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-primary-600 font-semibold">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.dietaryInfo.isVegetarian && (
                          <span className="ml-2 text-green-600 text-sm">Vegetarian</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToOrder(item)}
                      className="btn btn-primary ml-4"
                    >
                      Add to Order
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-4">
              <h2 className="text-2xl font-bold mb-4">Your Order</h2>
              {selectedItems.length > 0 ? (
                <>
                  <div className="space-y-4 mb-4">
                    {selectedItems.map((item) => (
                      <div key={item._id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <div className="flex items-center mt-1">
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                              className="text-gray-500 hover:text-primary-600"
                            >
                              -
                            </button>
                            <span className="mx-2">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                              className="text-gray-500 hover:text-primary-600"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => handleRemoveFromOrder(item._id)}
                            className="text-red-500 text-sm hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-4">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">
                        $
                        {selectedItems
                          .reduce((total, item) => total + item.price * item.quantity, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={orderStatus === 'loading'}
                      className="btn btn-primary w-full"
                    >
                      {orderStatus === 'loading' ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                    {orderStatus === 'error' && (
                      <p className="text-red-500 text-sm mt-2">
                        Failed to place order. Please try again.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-gray-600 text-center py-4">
                  Your order is empty. Add items from the menu to get started.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail; 