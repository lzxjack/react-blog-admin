import { db } from '../cloudBase';
import { DB } from '../dbConfig';

export const updateDataAPI = (dbName: DB, id: string, data: object) =>
  db
    .collection(dbName)
    .doc(id)
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
