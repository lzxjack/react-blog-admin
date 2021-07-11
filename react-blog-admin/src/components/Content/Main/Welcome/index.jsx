import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { getIP } from '../../../../redux/actions/ip';
import { avatarUrl } from '../../../../utils/constant';
import './index.css';

const Welcome = props => {
    const [timeText, setTimeText] = useState('');
    const [poemContent, setPoemContent] = useState('');
    const [poemTitle, setPoemTitle] = useState('');
    useEffect(() => {
        const hour = moment().hours();
        const timeText =
            hour < 6
                ? '凌晨好'
                : hour < 9
                ? '早上好'
                : hour < 11
                ? '上午好'
                : hour < 13
                ? '中午好'
                : hour < 17
                ? '下午好'
                : hour < 19
                ? '傍晚好'
                : hour < 22
                ? '晚上好'
                : '夜深了';
        setTimeText(timeText);
        require('jinrishici').load(res => {
            setPoemContent(res.data.content);
            setPoemTitle(res.data.origin.title);
            props.getIP(res.ipAddress);
        });
    }, []);
    return (
        <div className="WelcomeBox">
            <img src={avatarUrl} alt="头像" className="home-avatar" />
            <span className="welcomeTitle">{timeText}，飞鸟！</span>
            <span className="poemContent">
                “{poemContent}”
                <span className="poemTitle">&nbsp;&nbsp;——&nbsp;&nbsp;《{poemTitle}》</span>
            </span>
        </div>
    );
};

export default connect(() => ({}), { getIP })(Welcome);
