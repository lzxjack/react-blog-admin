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
    setLogData: (state: any, { payload: value }) => {
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

export const { setLogCount, setLogData } = logs.actions;

export default logs.reducer;
