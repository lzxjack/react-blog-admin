import { useState, useEffect } from 'react';
import Script from 'react-load-script';
import { twikooID } from '../../../utils/constant';
import './index.css';

const Msg = () => {
    // twikoo源文件加载完成后，加入配置的script标签
    const [twikooLoaded, setTwikooLoaded] = useState(false);
    useEffect(() => {
        if (!twikooLoaded) return;
        const twikooConfig = document.createElement('script');
        twikooConfig.innerHTML = `twikoo.init({envId:"${twikooID}",el:"#tcomment"})`;
        document.body.appendChild(twikooConfig);
        return () => {
            document.body.removeChild(twikooConfig);
        };
    }, [twikooLoaded]);

    return (
        <div className="MsgBox">
            <div id="tcomment"></div>
            <Script
                url="https://jack-img.oss-cn-hangzhou.aliyuncs.com/js/twikoo.all.min.js"
                onLoad={() => {
                    setTwikooLoaded(true);
                }}
            />
        </div>
    );
};

export default Msg;
