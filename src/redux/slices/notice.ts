import { createSlice } from '@reduxjs/toolkit';

import { DB } from '@/utils/dbConfig';

const notice = createSlice({
  name: DB.Notice,
  initialState: {
    value: '',
    isDone: false
  },
  reducers: {
    setNotice: (state: any, { payload: value }) => {
      return {
        ...state,
        value,
        isDone: true
      };
    }
  }
});

export const { setNotice } = notice.actions;

export default notice.reducer;
