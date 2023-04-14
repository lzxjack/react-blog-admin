import { db } from '../cloudBase';
import { DB } from '../dbConfig';

export const getDataAPI = (dbName: DB, sortKey?: string, isAsc?: boolean) =>
  db
    .collection(dbName)
    .orderBy(sortKey || 'date', isAsc ? 'asc' : 'desc')
    .limit(1000)
    .get()
    .then(res => res)
    .catch(err => err);
