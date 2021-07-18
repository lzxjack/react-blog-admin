import { useEffect } from 'react';
import { connect } from 'react-redux';
import { db, auth } from './utils/cloudBase';
import moment from 'moment';
import { login } from './redux/actions';
import {
    getClasses,
    getTags,
    getPoem,
    getArticles,
    getGalleries,
    getSays,
    getLinks,
    getShows,
    getAbout,
    getLogs,
} from './redux/actions';
import Loading from './components/Loading';
import Blog from './components/Blog';

const App = props => {
    // 匿名登录函数
    const anonymousLogin = async () => {
        await auth.anonymousAuthProvider().signIn();
        const anonymousLoginState = await auth.getLoginState();
        // 匿名登录状态给redux
        props.login(anonymousLoginState.isAnonymousAuth);
    };
    // 匿名登录
    useEffect(() => {
        anonymousLogin();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // 每日诗句
    const getDailyPoem = () => {
        require('jinrishici').load(res => {
            const obj = {
                content: res.data.content,
                title: res.data.origin.title,
                ip: res.ipAddress,
                date: moment().format('YYYY-MM-DD'),
            };
            props.getPoem(obj);
        });
    };
    // 向数据库获取各类数据
    const getDataFromDB = dbName => {
        db.collection(dbName)
            .get()
            .then(res => {
                switch (dbName) {
                    case 'articles': {
                        props.getArticles(res.data);
                        break;
                    }
                    case 'classes': {
                        props.getClasses(res.data);
                        break;
                    }
                    case 'tags': {
                        props.getTags(res.data);
                        break;
                    }
                    case 'about': {
                        props.getAbout(res.data);
                        break;
                    }
                    case 'galleries': {
                        props.getGalleries(res.data);
                        break;
                    }
                    case 'links': {
                        props.getLinks(res.data);
                        break;
                    }
                    case 'logs': {
                        props.getLogs(res.data);
                        break;
                    }
                    case 'says': {
                        props.getSays(res.data);
                        break;
                    }
                    case 'shows': {
                        props.getShows(res.data);
                        break;
                    }
                    default:
                        break;
                }
            });
    };
    // 获取各类数据
    useEffect(() => {
        if (!props.loginState) return;
        getDailyPoem();
        getDataFromDB('articles');
        getDataFromDB('classes');
        getDataFromDB('tags');
        getDataFromDB('about');
        getDataFromDB('galleries');
        getDataFromDB('links');
        getDataFromDB('logs');
        getDataFromDB('says');
        getDataFromDB('shows');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.loginState]);
    return <>{props.loginState ? <Blog /> : <Loading />}</>;
    // return <>{false ? <Blog /> : <Loading />}</>;
};

export default connect(state => ({ loginState: state.loginState }), {
    login,
    getClasses,
    getTags,
    getPoem,
    getArticles,
    getGalleries,
    getSays,
    getLinks,
    getShows,
    getAbout,
    getLogs,
})(App);
