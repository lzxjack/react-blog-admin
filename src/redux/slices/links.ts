import { createSlice } from '@reduxjs/toolkit';

import { DB } from '@/utils/dbConfig';

const links = createSlice({
  name: DB.Link,
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
    setLinkCount: (state: any, { payload: value }) => {
      return {
        ...state,
        count: {
          value,
          isDone: true
        }
      };
    },
    setLinkData: (state: any, { payload: { items, page } }) => {
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
    resetLinkData: (state: any) => {
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

export const { setLinkCount, setLinkData, resetLinkData } = links.actions;

export default links.reducer;
