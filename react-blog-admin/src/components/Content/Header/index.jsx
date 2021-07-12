import { LoginOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { login } from '../../../redux/actions';
import { notification, Popconfirm } from 'antd';
import { EnterOutlined } from '@ant-design/icons';
import './index.css';

const Header = props => {
    const openLogout = () => {
        notification.open({
            message: '已退出',
            description: '期待再次使用！',
            icon: <EnterOutlined style={{ color: 'blue' }} />,
            placement: 'bottomLeft',
            duration: 1.5,
        });
    };
    const turnLogout = () => {
        // 清空本地数据
        localStorage.clear();
        // 改变登录状态
        props.login(false);
        // 提示消息
        openLogout();
    };
    return (
        <div className="HeaderBox">
            <Popconfirm
                className="logoutBtn"
                placement="bottomRight"
                title="确定要退出登录吗？"
                onConfirm={turnLogout}
                okText="Yes"
                cancelText="No"
            >
                <LoginOutlined />
            </Popconfirm>
        </div>
    );
};

export default connect(() => ({}), { login })(Header);
