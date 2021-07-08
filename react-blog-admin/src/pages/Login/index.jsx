import { useRef } from 'react';
import { auth } from '../../utils/cloudBase';
import { connect } from 'react-redux';
import { login } from '../../redux/actions/loginState';
import { notification } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { avatarUrl } from '../../utils/constant';
import './index.css';

const Login = props => {
    const inputEmail = useRef();
    const inputpwd = useRef();

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
            duration: 1.5,
        });
    };

    // 登录
    const login = () => {
        auth.signInWithEmailAndPassword(inputEmail.current.value, inputpwd.current.value)
            .then(() => {
                props.login();
                // 登录成功
                openLoginNoti(true);
            })
            .catch(() => {
                // 登录失败
                openLoginNoti(false);
            });
    };

    return (
        <div className="loginBox">
            <div className="loginCenter">
                <img src={avatarUrl} className="avatar" alt="avatar" />
                <div className="EmailBox">
                    <div className="Email">邮箱</div>
                    <input type="text" className="inputEmail" ref={inputEmail} />
                </div>
                <div className="pwdBox">
                    <div className="pwd">密码</div>
                    <input type="password" className="inputpwd" ref={inputpwd} />
                </div>
                <div className="loginBtn" onClick={login}>
                    登录
                </div>
            </div>
        </div>
    );
};

export default connect(() => ({}), { login })(Login);
