import { createSlice } from '@reduxjs/toolkit';

const linkSum = createSlice({
  name: 'linkSum',
  initialState: '0',
  reducers: {
    setLinkSum: (state, { payload }) => {
      state = payload;
      return state;
    }
  }
});

export const { setLinkSum } = linkSum.actions;

export default linkSum.reducer;
