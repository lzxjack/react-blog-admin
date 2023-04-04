import { createSlice } from '@reduxjs/toolkit';

const articleSum = createSlice({
  name: 'articleSum',
  initialState: '0',
  reducers: {
    setArticleSum: (state: any, { payload }) => {
      state = payload;
      return state;
    }
  }
});

export const { setArticleSum } = articleSum.actions;

export default articleSum.reducer;
