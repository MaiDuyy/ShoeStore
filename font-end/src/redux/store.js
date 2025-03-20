import { configureStore } from '@reduxjs/toolkit';
import featuredProductsReducer from './features/featuredProductsSlice';
import categoriesReducer from './features/categoriesSlice';

export const store = configureStore({
  reducer: {
    featuredProducts: featuredProductsReducer,
    categories: categoriesReducer,
  },
}); 