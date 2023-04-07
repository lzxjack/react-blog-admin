import { auth } from '../cloudBase';

export const authLoginAPI = (adminEmail: string, adminPwd: string) =>
  auth
    .signInWithEmailAndPassword(adminEmail, adminPwd)
    .then(() => true)
    .catch(() => false);
