import { createSlice } from '@reduxjs/toolkit';

const saySum = createSlice({
  name: 'saySum',
  initialState: '0',
  reducers: {
    setSaySum: (state, { payload }) => {
      state = payload;
      return state;
    }
  }
});

export const { setSaySum } = saySum.actions;

export default saySum.reducer;
