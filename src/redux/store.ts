import { configureStore } from '@reduxjs/toolkit';

export default configureStore({
  reducer: {},
  devTools: process.env.NODE_ENV !== 'production'
});
