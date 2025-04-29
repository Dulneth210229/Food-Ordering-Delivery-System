import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createRestaurant,
  updateRestaurant,
  fetchRestaurantById,
  clearError
} from '../../store/slices/restaurantSlice';

const RestaurantForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentRestaurant: restaurant, loading, error } = useSelector(
    (state) => state.restaurants
  );

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    cuisine: [],
    priceRange: '$',
    openingHours: {
      monday: { open: '09:00', close: '22:00' },
      tuesday: { open: '09:00', close: '22:00' },
      wednesday: { open: '09:00', close: '22:00' },
      thursday: { open: '09:00', close: '22:00' },
      friday: { open: '09:00', close: '23:00' },
      saturday: { open: '10:00', close: '23:00' },
      sunday: { open: '10:00', close: '22:00' }
    },
    images: []
  });

  const [cuisineInput, setCuisineInput] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchRestaurantById(id));
    }
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (restaurant && id) {
      setFormData(restaurant);
    }
  }, [restaurant, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleOpeningHoursChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleAddCuisine = () => {
    if (cuisineInput.trim() && !formData.cuisine.includes(cuisineInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        cuisine: [...prev.cuisine, cuisineInput.trim()]
      }));
      setCuisineInput('');
    }
  };

  const handleRemoveCuisine = (cuisine) => {
    setFormData((prev) => ({
      ...prev,
      cuisine: prev.cuisine.filter((c) => c !== cuisine)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await dispatch(updateRestaurant({ id, data: formData })).unwrap();
      } else {
        await dispatch(createRestaurant(formData)).unwrap();
      }
      navigate('/restaurants');
    } catch (error) {
      // Error is handled by the reducer
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        {id ? 'Edit Restaurant' : 'Add New Restaurant'}
      </h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Restaurant Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700">
                Price Range
              </label>
              <select
                id="priceRange"
                name="priceRange"
                value={formData.priceRange}
                onChange={handleChange}
                required
                className="input mt-1"
              >
                <option value="$">$</option>
                <option value="$$">$$</option>
                <option value="$$$">$$$</option>
                <option value="$$$$">$$$$</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Address</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                required
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="address.city"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                required
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                id="address.state"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                required
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input
                type="text"
                id="address.zipCode"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                required
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                id="address.country"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                required
                className="input mt-1"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Cuisine Types</h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={cuisineInput}
                onChange={(e) => setCuisineInput(e.target.value)}
                placeholder="Add cuisine type"
                className="input flex-1"
              />
              <button
                type="button"
                onClick={handleAddCuisine}
                className="btn btn-secondary"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.cuisine.map((cuisine) => (
                <span
                  key={cuisine}
                  className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full flex items-center"
                >
                  {cuisine}
                  <button
                    type="button"
                    onClick={() => handleRemoveCuisine(cuisine)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Opening Hours</h2>
          
          <div className="space-y-4">
            {Object.entries(formData.openingHours).map(([day, hours]) => (
              <div key={day} className="grid grid-cols-3 gap-4 items-center">
                <span className="capitalize">{day}</span>
                <input
                  type="time"
                  value={hours.open}
                  onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                  className="input"
                />
                <input
                  type="time"
                  value={hours.close}
                  onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                  className="input"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/restaurants')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : id ? (
              'Update Restaurant'
            ) : (
              'Create Restaurant'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantForm; 