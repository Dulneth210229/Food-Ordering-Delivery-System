import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Async thunks
export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/restaurants`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchRestaurantById = createAsyncThunk(
  'restaurants/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/restaurants/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createRestaurant = createAsyncThunk(
  'restaurants/create',
  async (restaurantData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post(
        `${API_URL}/restaurants`,
        restaurantData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateRestaurant = createAsyncThunk(
  'restaurants/update',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.put(
        `${API_URL}/restaurants/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteRestaurant = createAsyncThunk(
  'restaurants/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.delete(`${API_URL}/restaurants/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  restaurants: [],
  currentRestaurant: null,
  loading: false,
  error: null
};

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRestaurant: (state) => {
      state.currentRestaurant = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Restaurants
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch restaurants';
      })
      // Fetch Restaurant by ID
      .addCase(fetchRestaurantById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRestaurant = action.payload;
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch restaurant';
      })
      // Create Restaurant
      .addCase(createRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants.push(action.payload);
      })
      .addCase(createRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create restaurant';
      })
      // Update Restaurant
      .addCase(updateRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.restaurants.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.restaurants[index] = action.payload;
        }
        if (state.currentRestaurant?._id === action.payload._id) {
          state.currentRestaurant = action.payload;
        }
      })
      .addCase(updateRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update restaurant';
      })
      // Delete Restaurant
      .addCase(deleteRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = state.restaurants.filter(r => r._id !== action.payload);
        if (state.currentRestaurant?._id === action.payload) {
          state.currentRestaurant = null;
        }
      })
      .addCase(deleteRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete restaurant';
      });
  }
});

export const { clearError, clearCurrentRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer; 