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
      done: []
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
    setArticleData: (state: any, { payload: { items, page } }) => {
      const newValue = [...state.data.value];
      newValue[page] = items;
      const newDone = [...new Set([...state.data.done, page])];
      return {
        ...state,
        data: {
          value: newValue,
          done: newDone
        }
      };
    },
    resetArticleData: (state: any) => {
      return {
        ...state,
        data: {
          value: [],
          done: []
        }
      };
    },
    resetArticleCount: (state: any) => {
      return {
        ...state,
        count: {
          value: 0,
          isDone: false
        }
      };
    }
  }
});

export const { setArticleCount, setArticleData, resetArticleData, resetArticleCount } =
  articles.actions;

export default articles.reducer;
