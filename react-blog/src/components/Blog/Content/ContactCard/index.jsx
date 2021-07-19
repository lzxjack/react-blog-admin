import { GithubOutlined, WechatOutlined, QqOutlined } from '@ant-design/icons';
import CsdnIcon from './CsdnIcon';
import { Popover } from 'antd';
import './index.css';

const ContactCard = () => {
    const weChat = (
        <img
            src="https://jack-img.oss-cn-hangzhou.aliyuncs.com/img/20210719213208.jpg"
            alt="weChat"
            className="QR-code"
        />
    );
    const QQ = (
        <img
            src="https://jack-img.oss-cn-hangzhou.aliyuncs.com/img/20210719214515.jpg"
            alt="QQ"
            className="QR-code"
        />
    );
    return (
        <div className="ContactCard-box">
            <a
                className="social-btn"
                href="https://github.com/lzxjack"
                target="_blank"
                rel="noreferrer"
            >
                <GithubOutlined />
            </a>
            <a
                className="social-btn csdn-btn"
                href="https://blog.csdn.net/Jack_lzx"
                target="_blank"
                rel="noreferrer"
            >
                <CsdnIcon />
            </a>
            <Popover
                className="social-btn"
                color="rgb(180, 180, 0)"
                content={weChat}
                overlayClassName="social-btn-card"
            >
                <WechatOutlined />
            </Popover>

            <Popover
                className="social-btn"
                color="rgb(180, 180, 0)"
                content={QQ}
                overlayClassName="social-btn-card"
            >
                <QqOutlined />
            </Popover>
        </div>
    );
};

export default ContactCard;
