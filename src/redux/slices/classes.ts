import { createSlice } from '@reduxjs/toolkit';

import { DB } from '@/utils/dbConfig';

const classes = createSlice({
  name: DB.Class,
  initialState: {
    value: [],
    isDone: false
  },
  reducers: {
    setClasses: (state: any, { payload: value }) => {
      return {
        ...state,
        value,
        isDone: true
      };
    },
    resetClasses: (state: any) => {
      return {
        ...state,
        value: [],
        isDone: false
      };
    }
  }
});

export const { setClasses, resetClasses } = classes.actions;

export default classes.reducer;
