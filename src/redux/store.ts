import { configureStore } from '@reduxjs/toolkit';

import isLogin from '@/redux/slices/isLogin';

export default configureStore({
  reducer: { isLogin },
  devTools: process.env.NODE_ENV !== 'production'
});
