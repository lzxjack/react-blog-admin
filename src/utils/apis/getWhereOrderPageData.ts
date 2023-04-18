import { db } from '../cloudBase';
import { DB } from '../dbConfig';

export const getWhereOrderPageDataAPI = (config: {
  dbName: DB;
  where?: object;
  sortKey?: string;
  isAsc?: boolean;
  page: number;
  size: number;
}) => {
  const { dbName, sortKey = 'date', isAsc = false, page, size, where = {} } = config;

  return db
    .collection(dbName)
    .where(where)
    .orderBy(sortKey, isAsc ? 'asc' : 'desc')
    .skip((page - 1) * size)
    .limit(size)
    .get()
    .then(res => res)
    .catch(err => err);
};
