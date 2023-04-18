import { db } from '../cloudBase';
import { DB } from '../dbConfig';

export const getTotalAPI = ({ dbName, where = {} }: { dbName: DB; where?: object }) =>
  db
    .collection(dbName)
    .where(where)
    .count()
    .then(res => res)
    .catch(err => err);
