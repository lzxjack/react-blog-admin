import { db } from '../cloudBase';
import { DB } from '../dbConfig';

export const getDataByIdAPI = (dbName: DB, id: string) =>
  db
    .collection(dbName)
    .doc(id)
    .get()
    .then(res => res)
    .catch(err => err);
