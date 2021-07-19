// import { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import About from '../../../pages/About';
import Article from '../../../pages/Article';
import Gallery from '../../../pages/Gallery';
import Home from '../../../pages/Home';
import Link from '../../../pages/Link';
import Log from '../../../pages/Log';
import Msg from '../../../pages/Msg';
import Say from '../../../pages/Say';
import Show from '../../../pages/Show';
import BlogCard from './BlogCard';
import BlogData from './BlogData';
import ContactCard from './ContactCard';
import ClockCard from './ClockCard';

import './index.css';

const Content = () => {
    return (
        <>
            <div className="nav-bottm"></div>
            {/* 整个页面 */}
            <div className="Content-box">
                {/* 通栏 */}
                <div className="content-center">
                    {/* 主要内容区 */}
                    <div className="content-main">
                        <Switch>
                            <Route path="/home" component={Home} />
                            <Route path="/article" component={Article} />
                            <Route path="/gallery" component={Gallery} />
                            <Route path="/say" component={Say} />
                            <Route path="/msg" component={Msg} />
                            <Route path="/link" component={Link} />
                            <Route path="/show" component={Show} />
                            <Route path="/about" component={About} />
                            <Route path="/log" component={Log} />
                            <Redirect to="/home" />
                        </Switch>
                    </div>
                    {/* 侧边栏 */}
                    <div className="content-aside">
                        <BlogCard />
                        <ContactCard />
                        <BlogData />
                        <ClockCard />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Content;
