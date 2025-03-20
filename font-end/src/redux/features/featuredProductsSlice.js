import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_URLS from '../../config/config';

// Async thunk to fetch featured products by category
export const fetchFeaturedProducts = createAsyncThunk(
  'featuredProducts/fetchByCategory',
  async (categoryId) => {
    try {
      const response = await axios.get(API_URLS.GET_TOP_PRODUCTS_BY_CATEGORY(categoryId));
      return {
        categoryId,
        products: response.data
      };
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  categories: {}, // Will store products by category ID
  loading: false,
  error: null
};

const featuredProductsSlice = createSlice({
  name: 'featuredProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        const { categoryId, products } = action.payload;
        state.categories[categoryId] = products;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default featuredProductsSlice.reducer; 