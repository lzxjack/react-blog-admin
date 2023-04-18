import { clearCache } from 'ahooks';

import { DB } from './dbConfig';

// 删除所有分页缓存数据
export const myClearCache = ({
  DBName,
  page,
  totalPage,
  deleteTotal
}: {
  DBName: DB;
  page: number;
  totalPage: number;
  deleteTotal: boolean;
}) => {
  for (let i = page; i <= totalPage; i++) {
    clearCache(`${DBName}-data-${i}`);
  }
  deleteTotal && clearCache(`${DBName}-total`);
};

// 删除分页缓存某页数据
export const myClearCacheOnePage = (DBName: DB, page: number) => {
  clearCache(`${DBName}-data-${page}`);
};

// 计算分页数量
export const getTotalPage = (total: number, pageSize: number) => {
  const totalPage = total / pageSize;
  if (Number.isInteger(totalPage)) {
    return totalPage;
  }
  return Math.ceil(totalPage);
};

// 计算删除一项后，当前的分页
export const getAfterDeletedPage = (total: number, nowPage: number, pageSize: number) => {
  if (total === 1) return 1;
  if (total % pageSize === 1 && nowPage === Math.ceil(total / pageSize)) {
    return nowPage - 1;
  }
  return nowPage;
};

// allData、someData数组，判断someData是否是allData的子集
export const isSubset = (allData: string[], someData: string[]) => {
  return someData.every(elem => allData.includes(elem));
};

// 判断日期字符串是否合法
export const isValidDateString = (dateString: string, hasTime: boolean) => {
  const regex = hasTime ? /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/ : /^\d{4}-\d{2}-\d{2}$/;

  if (!regex.test(dateString)) {
    return false;
  }

  const date = Date.parse(dateString);
  if (isNaN(date)) {
    return false;
  }

  return true;
};

export const containsChineseCharacters = (str: string) => {
  const regex = /[\u4e00-\u9fa5]/;
  return regex.test(str);
};
