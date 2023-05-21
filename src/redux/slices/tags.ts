import { createSlice } from '@reduxjs/toolkit';

import { DB } from '@/utils/dbConfig';

const tags = createSlice({
  name: DB.Tag,
  initialState: {
    value: [],
    isDone: false
  },
  reducers: {
    setTags: (state: any, { payload: value }) => {
      return {
        ...state,
        value,
        isDone: true
      };
    }
  }
});

export const { setTags } = tags.actions;

export default tags.reducer;
