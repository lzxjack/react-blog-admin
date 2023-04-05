interface DataSumType {
  article: string;
  draft: string;
  link: string;
  msg: string;
  say: string;
}

interface stateType {
  dataSum: DataSumType;
}

export const selectDataSum = (state: stateType) => state.dataSum;
