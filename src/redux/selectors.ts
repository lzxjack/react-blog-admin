import { DB } from '@/utils/dbConfig';

interface dataType {
  value: any[];
  isDone: boolean;
}

interface stringType {
  value: string;
  isDone: boolean;
}

interface aboutType extends stringType {
  id: string;
}

export interface baseType {
  count: {
    value: number;
    isDone: boolean;
  };
  data: {
    value: any[][];
    done: number[];
  };
}

export interface stateType {
  [DB.Article]: baseType;
  [DB.Show]: baseType;
  [DB.Draft]: baseType;
  [DB.Link]: baseType;
  [DB.Log]: baseType;
  [DB.Say]: baseType;
  [DB.Msg]: baseType;
  [DB.Class]: dataType;
  [DB.Tag]: dataType;
  [DB.Notice]: stringType;
  [DB.About]: {
    aboutMe: aboutType;
    aboutSite: aboutType;
  };
}

export const selectArticle = (state: stateType) => state[DB.Article];
export const selectLink = (state: stateType) => state[DB.Link];
export const selectLog = (state: stateType) => state[DB.Log];
export const selectSay = (state: stateType) => state[DB.Say];
export const selectMsg = (state: stateType) => state[DB.Msg];
export const selectClass = (state: stateType) => state[DB.Class];
export const selectTag = (state: stateType) => state[DB.Tag];
export const selectNotice = (state: stateType) => state[DB.Notice];
export const selectAbout = (state: stateType) => state[DB.About];
export const selectShow = (state: stateType) => state[DB.Show];
export const selectDraft = (state: stateType) => state[DB.Draft];
