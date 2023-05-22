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
    setShowData: (state: any, { payload: { items, page } }) => {
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
    resetShowData: (state: any) => {
      return {
        ...state,
        data: {
          value: [],
          done: []
        }
      };
    }
  }
});

export const { setShowCount, setShowData, resetShowData } = shows.actions;

export default shows.reducer;
