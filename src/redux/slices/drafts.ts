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
    setDraftData: (state: any, { payload: value }) => {
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

export const { setDraftCount, setDraftData } = drafts.actions;

export default drafts.reducer;
