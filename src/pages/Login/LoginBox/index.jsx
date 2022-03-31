import { useState } from 'react';
import { auth } from '../../../utils/cloudBase';
import { connect } from 'react-redux';
import { login } from '../../../redux/actions';
import { notification } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { avatarUrl, visitorEmail, visitorPwd } from '../../../utils/constant';
import './index.css';

const LoginBox = props => {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');

  // 提示消息的函数
  // true登录成功/false登录失败
  const openLoginNoti = state => {
    const message = state ? '登录成功' : '登录失败';
    const description = state
      ? '欢迎进入博客后台管理系统！'
      : '用户名或密码不正确，请重新登录！';
    const icon = state ? (
      <CheckOutlined style={{ color: 'blue' }} />
    ) : (
      <CloseOutlined style={{ color: 'red' }} />
    );
    notification.open({
      message,
      description,
      icon,
      placement: 'bottomLeft',
      duration: 1.5
    });
  };

  // 登录
  const login = isVisitor => {
    const EMAIL = isVisitor ? visitorEmail : email;
    const PWD = isVisitor ? visitorPwd : pwd;
    auth
      .signInWithEmailAndPassword(EMAIL, PWD)
      .then(() => {
        // 登录成功
        props.login(true);
        openLoginNoti(true);
      })
      .catch(() => {
        // 登录失败
        props.login(false);
        openLoginNoti(false);
      });
  };

  return (
    <div className='loginBox'>
      <img src={avatarUrl} className='avatar' alt='avatar' />
      <div className='EmailBox'>
        <div className='Email'>邮箱</div>
        <input
          type='text'
          className='inputEmail'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className='pwdBox'>
        <div className='pwd'>密码</div>
        <input
          type='password'
          className='inputpwd'
          value={pwd}
          onChange={e => setPwd(e.target.value)}
        />
      </div>

      <div className='loginBtn' onClick={() => login(false)}>
        登录
      </div>
      {/* <div className="visitorBtn" onClick={() => login(true)}>
                游客
            </div> */}
    </div>
  );
};

export default connect(() => ({}), { login })(LoginBox);
