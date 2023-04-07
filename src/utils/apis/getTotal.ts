import { db } from '../cloudBase';
import { DB } from '../dbConfig';

export const getTotalAPI = (dbName: DB) =>
  db
    .collection(dbName)
    .count()
    .then(res => res)
    .catch(err => err);
