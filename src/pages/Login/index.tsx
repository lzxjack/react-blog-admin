import { useTitle } from 'ahooks';
import { notification } from 'antd';
import classNames from 'classnames';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authLogin } from '@/utils/apis/authLogin';
import { avatarUrl, siteTitle, visitorEmail, visitorPwd } from '@/utils/constant';

import s from './index.scss';

const Login: React.FC = () => {
  useTitle(siteTitle);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (Email: string, pwd: string) => {
    const res = await authLogin(Email, pwd);
    res && navigate('admin');
    openLoginNoti(res);
  };

  const openLoginNoti = (state: boolean) => {
    state
      ? notification.success({
          message: '登录成功',
          description: '欢迎进入个人博客后台管理系统！',
          placement: 'bottomLeft',
          duration: 1.5
        })
      : notification.error({
          message: '登录失败',
          description: '用户名或密码不正确，请重新登录！',
          placement: 'bottomLeft',
          duration: 1.5
        });
  };

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
            <div className={s.btn} onClick={() => handleLogin(visitorEmail, visitorPwd)}>
              游客
            </div>
            <div className={s.btn} onClick={() => handleLogin(email, password)}>
              登录
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
