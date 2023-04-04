import { createSlice } from '@reduxjs/toolkit';

const msgSum = createSlice({
  name: 'msgSum',
  initialState: '0',
  reducers: {
    setMsgSum: (state, { payload }) => {
      state = payload;
      return state;
    }
  }
});

export const { setMsgSum } = msgSum.actions;

export default msgSum.reducer;
