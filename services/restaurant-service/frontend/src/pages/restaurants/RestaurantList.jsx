import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRestaurants } from '../../store/slices/restaurantSlice';

const RestaurantList = () => {
  const dispatch = useDispatch();
  const { restaurants, loading } = useSelector((state) => state.restaurants);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  // Get unique cuisines from all restaurants
  const cuisines = [...new Set(restaurants.flatMap(restaurant => restaurant.cuisine))];

  // Filter restaurants based on search term and filters
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = !priceFilter || restaurant.priceRange === priceFilter;
    const matchesCuisine = !cuisineFilter || restaurant.cuisine.includes(cuisineFilter);
    return matchesSearch && matchesPrice && matchesCuisine;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Restaurants</h1>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
          />
          
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="input"
          >
            <option value="">All Price Ranges</option>
            <option value="$">$</option>
            <option value="$$">$$</option>
            <option value="$$$">$$$</option>
            <option value="$$$$">$$$$</option>
          </select>
          
          <select
            value={cuisineFilter}
            onChange={(e) => setCuisineFilter(e.target.value)}
            className="input"
          >
            <option value="">All Cuisines</option>
            {cuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>

        {/* Add Restaurant Button */}
        {isAuthenticated && (user.role === 'admin' || user.role === 'restaurant_owner') && (
          <Link
            to="/restaurants/new"
            className="btn btn-primary mb-6 inline-block"
          >
            Add Restaurant
          </Link>
        )}
      </div>

      {/* Restaurant Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Link
              key={restaurant._id}
              to={`/restaurants/${restaurant._id}`}
              className="card hover:shadow-lg transition-shadow duration-300"
            >
              {restaurant.images && restaurant.images[0] && (
                <img
                  src={restaurant.images[0]}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
                <p className="text-gray-600 mb-2 line-clamp-2">
                  {restaurant.description}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-primary-600 font-semibold">
                    {restaurant.priceRange}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{restaurant.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {restaurant.cuisine.map((type) => (
                    <span
                      key={type}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No restaurants found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantList; 