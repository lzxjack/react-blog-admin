import classNames from 'classnames';
import React, { useState } from 'react';

import { avatarUrl } from '@/utils/constant';

import s from './index.scss';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className={s.LoginBox}>
      <div className={s.leftBox}>个人博客后台管理系统</div>
      <div className={s.rightBox}>
        <div className={s.avatarBox}>
          <img src={avatarUrl} alt='avatar' />
        </div>
        <div className={s.loginBox}>
          <div className={s.item}>
            <div className={s.key}>账号</div>
            <input
              type='text'
              className={s.value}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className={s.item}>
            <div className={s.key}>密码</div>
            <input
              type='password'
              className={s.value}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className={classNames(s.item, s.btnBox)}>
            <div className={s.btn}>游客</div>
            <div className={s.btn}>登录</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
