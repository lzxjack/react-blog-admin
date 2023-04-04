import { configureStore } from '@reduxjs/toolkit';

import articleSum from '@/redux/slices/articleSum';
import draftSum from '@/redux/slices/draftSum';
import linkSum from '@/redux/slices/linkSum';
import msgSum from '@/redux/slices/msgSum';
import saySum from '@/redux/slices/saySum';

export default configureStore({
  reducer: { articleSum, draftSum, linkSum, msgSum, saySum },
  devTools: process.env.NODE_ENV !== 'production'
});
