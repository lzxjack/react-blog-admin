import { configureStore } from '@reduxjs/toolkit';

// import isLogin from '@/redux/slices/isLogin';

export default configureStore({
  reducer: {},
  devTools: process.env.NODE_ENV !== 'production'
});
