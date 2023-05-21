import { Message } from '@arco-design/web-react';

import { updateWhereDataAPI } from './apis/updateWhereData';
import { _ } from './cloudBase';
import { failText, visitorText } from './constant';
import { DB } from './dbConfig';

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

// 改变指定分类的数量
export const classCountChange = (classText: string, type: 'add' | 'min') => {
  if (!classText) return;
  updateWhereDataAPI(
    DB.Class,
    { class: classText },
    { count: _.inc(type === 'add' ? 1 : -1) }
  ).then(res => {
    if (!res.success && !res.permission) {
      Message.warning(visitorText);
    } else if (res.success && res.permission) {
      Message.success(`${classText}成功${type === 'add' ? 1 : -1}`);
    } else {
      Message.warning(failText);
    }
  });
};
