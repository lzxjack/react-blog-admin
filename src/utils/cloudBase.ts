// 腾讯云开发的一些API
import cloudbase from '@cloudbase/js-sdk';

// adminUid、 prodEnv、 testEnv 需要自己提供
import { adminUid, prodEnv, testEnv } from '@/utils/env.secret';

import { nowEnv } from './constant';

const env = nowEnv === 'prod' ? prodEnv : testEnv;

export const app = cloudbase.init({ env });

export const auth = app.auth({ persistence: 'local' });

export const db = app.database();

export const _ = db.command;

export const isAdmin = () => {
  return nowEnv === 'prod' ? auth.currentUser?.uid === adminUid : true;
};
