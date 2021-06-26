import { LoginOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { logout } from '../../../redux/actions/loginState';
import { notification, Popconfirm } from 'antd';
import { EnterOutlined, FireOutlined } from '@ant-design/icons';
import './index.css';

const Header = props => {
    const openLogout = () => {
        notification.open({
            message: '已退出',
            description: '期待再次使用！',
            icon: <EnterOutlined style={{ color: 'blue' }} />,
            placement: 'bottomLeft',
            duration: 2,
        });
    };
    const turnLogout = () => {
        // 清空本地数据
        localStorage.clear();
        // 改变登录状态
        props.logout();
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
            <div className="darkBtn">
                <FireOutlined />
            </div>
        </div>
    );
};

export default connect(() => ({}), { logout })(Header);
