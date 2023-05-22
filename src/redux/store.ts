import { configureStore } from '@reduxjs/toolkit';

import about from '@/redux/slices/about';
import articles from '@/redux/slices/articles';
import classes from '@/redux/slices/classes';
import links from '@/redux/slices/links';
import logs from '@/redux/slices/logs';
import msgs from '@/redux/slices/msgs';
import notice from '@/redux/slices/notice';
import says from '@/redux/slices/says';
import tags from '@/redux/slices/tags';

export default configureStore({
  reducer: {
    articles,
    links,
    logs,
    says,
    allComments: msgs,
    classes,
    tags,
    notice,
    about
  },
  devTools: process.env.NODE_ENV !== 'production'
});
