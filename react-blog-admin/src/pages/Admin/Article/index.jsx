import { useState, useEffect } from 'react';
// import { Table } from 'antd';
import moment from 'moment';
import { db } from '../../../utils/cloudBase';
import './index.css';

const Article = props => {
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
            <div className="articlesBox" border="1">
                <table>
                    <thead>
                        <tr>
                            <th>标题</th>
                            <th>发布日期</th>
                            <th>分类</th>
                            <th>标签</th>
                            <th>URL</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map(item => {
                            return (
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td>{item.date}</td>
                                    <td>{item.class}</td>
                                    <td>{item.tags}</td>
                                    <td>{item.url}</td>
                                    <td></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Article;
