import { db } from '../cloudBase';
import { DB } from '../dbConfig';

export const deleteData = (dbName: DB, id: string) =>
  db
    .collection(dbName)
    .doc(id)
    .remove()
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
