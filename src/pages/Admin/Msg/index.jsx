// import { useState, useEffect } from 'react';
import useScript from '../../../hooks/useScript';
import { twikooUrl, twikooConfigUrl } from '../../../utils/constant';
import './index.css';

const Msg = () => {
    // 顺序引入两个外部js文件
    useScript(twikooUrl, twikooConfigUrl);

    return (
        <div className="MsgBox">
            <div id="tcomment"></div>
        </div>
    );
};

export default Msg;
