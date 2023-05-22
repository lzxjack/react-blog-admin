import { createSlice } from '@reduxjs/toolkit';

import { DB } from '@/utils/dbConfig';

const logs = createSlice({
  name: DB.Log,
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
    setLogCount: (state: any, { payload: value }) => {
      return {
        ...state,
        count: {
          value,
          isDone: true
        }
      };
    },
    setLogData: (state: any, { payload: { items, page } }) => {
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
    resetLogData: (state: any) => {
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

export const { setLogCount, setLogData, resetLogData } = logs.actions;

export default logs.reducer;
