import { Button, Input, Message } from '@arco-design/web-react';
import { useMemoizedFn, useTitle } from 'ahooks';
import React, { useState } from 'react';
import { BiLockAlt, BiUser } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

import { authLoginAPI } from '@/utils/apis/authLogin';
import { auth } from '@/utils/cloudBase';
import { avatarUrl, nowEnv, siteTitle, visitorEmail, visitorPwd } from '@/utils/constant';

import s from './index.scss';

const Login: React.FC = () => {
  useTitle(siteTitle);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = useMemoizedFn(async (Email: string, pwd: string) => {
    if (nowEnv === 'test') {
      const res = await auth.anonymousAuthProvider().signIn();
      if (res.isAnonymousAuth) {
        navigate('admin');
        Message.success('登录成功！欢迎进入个人博客后台管理系统！');
      }
      return;
    }
    if (!Email || !pwd) {
      Message.warning('登录失败！请输入账号、密码！');
      return;
    }
    const res = await authLoginAPI(Email, pwd);
    res && navigate('admin');
    res
      ? Message.success('登录成功！欢迎进入个人博客后台管理系统！')
      : Message.warning('登录失败！用户名或密码不正确，请重新登录！');
  });

  return (
    <div className={s.LoginBox}>
      <div className={s.leftBox}>个人博客后台管理系统</div>
      <div className={s.rightBox}>
        <div className={s.avatarBox}>
          <img src={avatarUrl} alt='avatar' />
        </div>
        <div className={s.loginBox}>
          <Input
            style={{ marginBottom: 20 }}
            size='large'
            prefix={<BiUser />}
            value={email}
            onChange={value => setEmail(value)}
          />
          <Input.Password
            style={{ marginBottom: 20 }}
            size='large'
            prefix={<BiLockAlt />}
            defaultValue='password'
            value={password}
            onChange={value => setPassword(value)}
          />
          <div className={s.btnBox}>
            <Button
              type='primary'
              status='success'
              size='large'
              onClick={() => handleLogin(visitorEmail, visitorPwd)}
            >
              {nowEnv === 'prod' ? '游客' : '测试'}
            </Button>
            <Button
              type='primary'
              size='large'
              onClick={() => handleLogin(email, password)}
            >
              登录
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
