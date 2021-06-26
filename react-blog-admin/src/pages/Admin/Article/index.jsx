import { useState, useEffect } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { db } from '../../../utils/cloudBase';
import './index.css';

const Article = props => {
    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'id',
        },
        {
            title: '发布日期',
            dataIndex: 'date',
            key: 'id',
        },
        {
            title: '分类',
            dataIndex: 'class',
            key: 'id',
        },
        {
            title: '标签',
            dataIndex: 'tags',
            key: 'id',
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'id',
        },
        {
            title: '操作',
        },
    ];
    const turnAddPage = () => {
        // 转到新建文章页面
        props.history.push('/admin/addArticle');
    };
    const [articles, setArticles] = useState([]);
    useEffect(() => {
        db.collection('articles')
            .get()
            .then(res => {
                // console.log(res.data);
                const articles = res.data.map(item => {
                    return {
                        id: item._id,
                        class: item.classes,
                        date: moment(item.date).format('YYYY-MM-DD HH:mm:ss'),
                        tags: item.tags,
                        title: item.title,
                        url: item.url,
                    };
                });
                setArticles(articles);
            });
    }, []);
    return (
        <>
            <div className="searchBox">
                <div className="addArticleBtn" onClick={turnAddPage}>
                    写文章
                </div>
            </div>
            <div className="articlesBox">
                <Table columns={columns} dataSource={articles} bordered></Table>
            </div>
        </>
    );
};

export default Article;
