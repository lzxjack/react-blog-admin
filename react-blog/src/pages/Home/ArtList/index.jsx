// import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { pageSize } from '../../../utils/constant';
import './index.css';

const ArtList = props => {
    return (
        <>
            {props.articles
                .slice((props.curPage - 1) * pageSize, props.curPage * pageSize)
                .map(item => (
                    <div className="article-item" key={item._id}>
                        <div className="article-item-title">{item.title}</div>
                        <p className="article-item-abstract">{item.content}</p>
                        <div className="article-item-info">
                            <span className="article-item-date">
                                {moment(item.date).format('YYYY-MM-DD')}
                            </span>
                            <div className="article-item-tags">
                                {item.tags.map(tag => (
                                    <span className="article-item-tag" key={tag}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
        </>
    );
};

export default connect(
    state => ({
        articles: state.articles,
        curPage: state.curPage,
    }),
    {}
)(ArtList);
