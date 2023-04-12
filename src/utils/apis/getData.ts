import { db } from '../cloudBase';
import { DB } from '../dbConfig';

export const getDataAPI = (dbName: DB) =>
  db
    .collection(dbName)
    .limit(1000)
    .get()
    .then(res => res)
    .catch(err => err);
