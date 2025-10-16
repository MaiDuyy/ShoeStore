import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/api';

// Async thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (item, { rejectWithValue }) => {
  try {
    // Normalize size and color to strings
    const normalizedItem = {
      ...item,
      size: typeof item.size === 'object' ? item.size?.name : item.size,
      color: typeof item.color === 'object' ? item.color?.name : item.color
    };
    
    const response = await api.post('/cart/add', normalizedItem);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
  }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async (item, { rejectWithValue }) => {
  try {
    // Normalize size and color to strings
    const normalizedItem = {
      ...item,
      size: typeof item.size === 'object' ? item.size?.name : item.size,
      color: typeof item.color === 'object' ? item.color?.name : item.color
    };
    
    const response = await api.put('/cart/update', normalizedItem);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({ productId, size, color }, { rejectWithValue }) => {
  try {
    // Normalize size and color to strings
    const normalizedSize = typeof size === 'object' ? size?.name : size;
    const normalizedColor = typeof color === 'object' ? color?.name : color;
    
    const response = await api.delete(`/cart/remove/${productId}`, {
      params: { 
        size: normalizedSize, 
        color: normalizedColor 
      }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
  }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    const response = await api.delete('/cart/clear');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount: 0,
    loading: false,
    error: null
  },
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalAmount = action.payload.totalAmount || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalAmount = 0;
      });
  }
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
