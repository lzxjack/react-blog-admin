// 腾讯云开发的一些API
import cloudbase from '@cloudbase/js-sdk';

import { adminUid, env } from './constant';

export const app = cloudbase.init({ env });

export const auth = app.auth({ persistence: 'local' });

export const db = app.database();

export const _ = db.command;

export const isAdmin = () => auth.currentUser?.uid === adminUid;
