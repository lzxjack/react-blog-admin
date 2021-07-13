import { useEffect, useState } from 'react';
import Nav from '../../components/Nav';
import Content from '../../components/Content';
import { connect } from 'react-redux';
import { getClasses, getTags, getPoem, getArticles } from '../../redux/actions';
import { db } from '../../utils/cloudBase';
import moment from 'moment';
import './index.css';

const Admin = props => {
    const [isMounted, setIsMounted] = useState(true);

    // 获取最新所有文章
    const getNewArticles = () => {
        db.collection('articles')
            .get()
            .then(res => {
                props.getArticles(res.data);
            });
    };
    // 向数据库获取所有标签
    const getAllTags = () => {
        db.collection('tags')
            .get()
            .then(res => {
                props.getTags(res.data);
            });
    };
    // 向数据库获取所有分类
    const getAllClasses = () => {
        db.collection('classes')
            .get()
            .then(res => {
                // console.log(res.data);
                props.getClasses(res.data);
            });
    };
    // 获得每日诗句信息
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
    // 组件挂载，获取一次所有标签和分类
    useEffect(() => {
        if (isMounted) {
            getAllTags();
            getAllClasses();
            getNewArticles();
            getDailyPoem();
        }
        return () => {
            setIsMounted(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted]);

    return (
        <div className="AdminBox">
            <div className="navBack"></div>
            <Nav />
            <Content />
        </div>
    );
};

export default connect(() => ({}), {
    getClasses,
    getTags,
    getArticles,
    getPoem,
})(Admin);
