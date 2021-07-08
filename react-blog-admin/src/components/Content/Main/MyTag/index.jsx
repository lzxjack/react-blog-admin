import { useState, useEffect } from 'react';
// import { Tag } from 'antd';
import './index.css';

const MyTag = () => {
    return (
        <div className="MyTagBox">
            <div className="homeSingleBox">标签</div>
            <div className="classCreateBox">
                <input type="text" placeholder="请输入新的标签..." className="classCreateInput" />
                <div className="classCreateBtn">新建</div>
            </div>
            <div className="classesList">
                <span className="theTag">JavaScript</span>
                <span className="theTag">CSS</span>
                <span className="theTag">面试</span>
            </div>
        </div>
    );
};

export default MyTag;
