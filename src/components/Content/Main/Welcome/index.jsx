import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { avatarUrl, adminUid, visitorAvatar } from '../../../../utils/constant';
import { auth } from '../../../../utils/cloudBase';
import './index.css';

const Welcome = props => {
    const [name, setName] = useState('游客');
    const [avatar, setAvatar] = useState(visitorAvatar);
    useEffect(() => {
        if (auth.currentUser.uid === adminUid) {
            setName('飞鸟');
            setAvatar(avatarUrl);
        }
    }, []);
    const [timeText, setTimeText] = useState('');
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
    }, []);
    return (
        <div className="WelcomeBox">
            <img src={avatar} alt="头像" className="home-avatar" />
            <span className="welcomeTitle">
                {timeText}，<span className="user-name">{name}</span>！
            </span>
            <span className="poemContent">
                “{props.poem.content}”
                <span className="poemTitle">&nbsp;&nbsp;——&nbsp;&nbsp;{props.poem.author}</span>
            </span>
        </div>
    );
};

export default connect(
    state => ({
        poem: state.poem,
    }),
    {}
)(Welcome);
