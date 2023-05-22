import { createSlice } from '@reduxjs/toolkit';

import { DB } from '@/utils/dbConfig';

const about = createSlice({
  name: DB.About,
  initialState: {
    aboutMe: {
      id: '',
      value: '',
      isDone: false
    },
    aboutSite: {
      id: '',
      value: '',
      isDone: false
    }
  },
  reducers: {
    setAboutMe: (state: any, { payload: { id, value } }) => {
      return {
        ...state,
        aboutMe: {
          id,
          value,
          isDone: true
        }
      };
    },
    setAboutSite: (state: any, { payload: { id, value } }) => {
      return {
        ...state,
        aboutSite: {
          id,
          value,
          isDone: true
        }
      };
    }
  }
});

export const { setAboutMe, setAboutSite } = about.actions;

export default about.reducer;
