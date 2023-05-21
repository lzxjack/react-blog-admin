import { createSlice } from '@reduxjs/toolkit';

import { DB } from '@/utils/dbConfig';

const links = createSlice({
  name: DB.Link,
  initialState: {
    count: {
      value: 0,
      isDone: false
    },
    data: {
      value: [],
      isDone: false
    }
  },
  reducers: {
    setLinkCount: (state: any, { payload: value }) => {
      return {
        ...state,
        count: {
          value,
          isDone: true
        }
      };
    },
    setLinkData: (state: any, { payload: value }) => {
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

export const { setLinkCount, setLinkData } = links.actions;

export default links.reducer;
