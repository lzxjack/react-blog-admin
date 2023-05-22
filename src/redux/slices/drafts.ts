import { createSlice } from '@reduxjs/toolkit';

import { DB } from '@/utils/dbConfig';

const drafts = createSlice({
  name: DB.Draft,
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
    setDraftCount: (state: any, { payload: value }) => {
      return {
        ...state,
        count: {
          value,
          isDone: true
        }
      };
    },
    setDraftData: (state: any, { payload: { items, page } }) => {
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
    resetDraftData: (state: any) => {
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

export const { setDraftCount, setDraftData, resetDraftData } = drafts.actions;

export default drafts.reducer;
