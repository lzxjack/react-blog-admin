import { db } from '../cloudBase';
import { DB } from '../dbConfig';

export const getWhereDataAPI = (dbName: DB, where: object) =>
  db
    .collection(dbName)
    .where(where)
    .limit(1000)
    .get()
    .then(res => res)
    .catch(err => err);
