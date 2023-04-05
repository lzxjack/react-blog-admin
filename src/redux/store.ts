import { configureStore } from '@reduxjs/toolkit';

import dataSum from '@/redux/slices/dataSum';

export default configureStore({
  reducer: { dataSum },
  devTools: process.env.NODE_ENV !== 'production'
});
