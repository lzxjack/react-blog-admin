import { createSlice } from '@reduxjs/toolkit';

import { DB } from '@/utils/dbConfig';

const shows = createSlice({
  name: DB.Show,
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
    setShowCount: (state: any, { payload: value }) => {
      return {
        ...state,
        count: {
          value,
          isDone: true
        }
      };
    },
    setShowData: (state: any, { payload: value }) => {
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

export const { setShowCount, setShowData } = shows.actions;

export default shows.reducer;
