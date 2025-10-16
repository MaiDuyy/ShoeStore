import { configureStore } from '@reduxjs/toolkit';
import featuredProductsReducer from './features/featuredProductsSlice';
import categoriesReducer from './features/categoriesSlice';
import cartReducer from './features/cartSlice';
import orderReducer from './features/orderSlice';

export const store = configureStore({
  reducer: {
    featuredProducts: featuredProductsReducer,
    categories: categoriesReducer,
    cart: cartReducer,
    order: orderReducer,
  },
}); 