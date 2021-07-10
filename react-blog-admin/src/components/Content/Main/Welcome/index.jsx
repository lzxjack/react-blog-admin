// import { useState, useEffect } from 'react';
import { avatarUrl } from '../../../../utils/constant';
import './index.css';

const Welcome = () => {
    return (
        <div className="WelcomeBox">
            <img src={avatarUrl} alt="头像" className="home-avatar" />
        </div>
    );
};

export default Welcome;
