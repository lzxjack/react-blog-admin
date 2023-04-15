import { db } from '../cloudBase';
import { DB } from '../dbConfig';

export const getPageDataAPI = (config: {
  dbName: DB;
  sortKey?: string;
  isAsc?: boolean;
  page: number;
  size: number;
}) => {
  const { dbName, sortKey = 'date', isAsc = false, page, size } = config;

  return db
    .collection(dbName)
    .orderBy(sortKey, isAsc ? 'asc' : 'desc')
    .skip((page - 1) * size)
    .limit(size)
    .get()
    .then(res => res)
    .catch(err => err);
};
