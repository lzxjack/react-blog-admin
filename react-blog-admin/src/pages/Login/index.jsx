import { useRef } from 'react';
import { auth } from '../../utils/cloudBase';
import { connect } from 'react-redux';
import { login } from '../../redux/actions/loginState';
import { notification } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import './index.css';

const Login = props => {
    const inputEmail = useRef(),
        inputpwd = useRef();

    const openLoginError = () => {
        notification.open({
            message: '登录失败',
            description: '用户名或密码不正确，请重新登录！',
            icon: <CloseOutlined style={{ color: 'red' }} />,
            placement: 'bottomLeft',
            duration: 2,
        });
    };

    const openLoginSuccess = () => {
        notification.open({
            message: '登录成功',
            description: '欢迎进入博客后台管理系统！',
            icon: <CheckOutlined style={{ color: 'blue' }} />,
            placement: 'bottomLeft',
            duration: 2,
        });
    };

    const login = () => {
        auth.signInWithEmailAndPassword(inputEmail.current.value, inputpwd.current.value)
            .then(() => {
                props.login();
                openLoginSuccess();
            })
            .catch(() => {
                openLoginError();
            });
    };

    return (
        <div className="loginBox">
            <div className="loginCenter">
                <img src="/Jack.jpg" className="avatar" alt="avatar" />
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
