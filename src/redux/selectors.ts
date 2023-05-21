import { DB } from '@/utils/dbConfig';

export interface baseType {
  count: {
    value: number;
    isDone: boolean;
  };
  data: {
    value: any[];
    isDone: boolean;
  };
}

export interface stateType {
  [DB.Article]: baseType;
  [DB.Link]: baseType;
  [DB.Log]: baseType;
  [DB.Say]: baseType;
  [DB.Msg]: baseType;
}

export const selectArticle = (state: stateType) => state[DB.Article];
export const selectLink = (state: stateType) => state[DB.Link];
export const selectLog = (state: stateType) => state[DB.Log];
export const selectSay = (state: stateType) => state[DB.Say];
export const selectMsg = (state: stateType) => state[DB.Msg];
