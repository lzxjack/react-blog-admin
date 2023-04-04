export interface stateType {
  articleSum: string;
  draftSum: string;
  linkSum: string;
  msgSum: string;
  saySum: string;
}

export const selectArticleSum = (state: stateType) => state.articleSum;
export const selectDraftSum = (state: stateType) => state.draftSum;
export const selectLinkSum = (state: stateType) => state.linkSum;
export const selectMsgSum = (state: stateType) => state.msgSum;
export const selectSaySum = (state: stateType) => state.saySum;
