import { createSlice } from '@reduxjs/toolkit';

import { DB } from '@/utils/dbConfig';

const articles = createSlice({
  name: DB.Article,
  initialState: {
    count: {
      value: 0,
      isDone: false
    },
    data: {
      value: [],
      isDone: false
    }
  },
  reducers: {
    setArticleCount: (state: any, { payload: value }) => {
      return {
        ...state,
        count: {
          value,
          isDone: true
        }
      };
    },
    setArticleData: (state: any, { payload: value }) => {
      return {
        ...state,
        data: {
          value,
          isDone: true
        }
      };
    }
  }
});

export const { setArticleCount, setArticleData } = articles.actions;

export default articles.reducer;
