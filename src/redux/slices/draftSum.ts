import { createSlice } from '@reduxjs/toolkit';

const draftSum = createSlice({
  name: 'draftSum',
  initialState: '0',
  reducers: {
    setDraftSum: (state, { payload }) => {
      state = payload;
      return state;
    }
  }
});

export const { setDraftSum } = draftSum.actions;

export default draftSum.reducer;
