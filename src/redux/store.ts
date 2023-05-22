import { configureStore } from '@reduxjs/toolkit';

import about from '@/redux/slices/about';
import articles from '@/redux/slices/articles';
import classes from '@/redux/slices/classes';
import drafts from '@/redux/slices/drafts';
import links from '@/redux/slices/links';
import logs from '@/redux/slices/logs';
import msgs from '@/redux/slices/msgs';
import notice from '@/redux/slices/notice';
import says from '@/redux/slices/says';
import shows from '@/redux/slices/shows';
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
    about,
    drafts,
    shows
  },
  devTools: process.env.NODE_ENV !== 'production'
});
