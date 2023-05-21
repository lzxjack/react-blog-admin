import { createSlice } from '@reduxjs/toolkit';

import { DB } from '@/utils/dbConfig';

const says = createSlice({
  name: DB.Say,
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
    setSayCount: (state: any, { payload: value }) => {
      return {
        ...state,
        count: {
          value,
          isDone: true
        }
      };
    },
    setSayData: (state: any, { payload: value }) => {
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

export const { setSayCount, setSayData } = says.actions;

export default says.reducer;
