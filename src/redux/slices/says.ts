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
      done: []
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
    setSayData: (state: any, { payload: { items, page } }) => {
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
    resetSayData: (state: any) => {
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

export const { setSayCount, setSayData, resetSayData } = says.actions;

export default says.reducer;
