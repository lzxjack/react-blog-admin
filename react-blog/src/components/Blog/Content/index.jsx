import { useState, useEffect } from 'react';
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
import SocialCard from './SocialCard';
import ClockCard from './ClockCard';
import TagCard from './TagCard';
import SiteCard from './SiteCard';

import './index.css';

const Content = () => {
    const [isFixed, setIsFixed] = useState(false);
    // const aside = document.getElementsByClassName('content-aside');
    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset >= 720) {
                setIsFixed(true);
                console.log(111);
            } else {
                setIsFixed(false);
            }
        });
    });
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
                    <div className={isFixed ? 'content-aside aside-fixed' : 'content-aside'}>
                        <BlogCard />
                        <SocialCard />
                        <BlogData />
                        <ClockCard />
                        <TagCard />
                        <SiteCard />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Content;
