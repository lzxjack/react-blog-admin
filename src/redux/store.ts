import { configureStore } from '@reduxjs/toolkit';

import articles from '@/redux/slices/articles';
import links from '@/redux/slices/links';
import logs from '@/redux/slices/logs';
import msgs from '@/redux/slices/msgs';
import says from '@/redux/slices/says';

export default configureStore({
  reducer: { articles, links, logs, says, allComments: msgs },
  devTools: process.env.NODE_ENV !== 'production'
});
