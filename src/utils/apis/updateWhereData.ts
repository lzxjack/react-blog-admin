import { db } from '../cloudBase';
import { DB } from '../dbConfig';

export const updateWhereDataAPI = (dbName: DB, where: object, data: object) =>
  db
    .collection(dbName)
    .where(where)
    .update(data)
    .then(res => {
      if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
        return {
          success: false,
          permission: false
        };
      }
      return { success: true, permission: true };
    })
    .catch(() => ({
      success: false,
      permission: true
    }));
