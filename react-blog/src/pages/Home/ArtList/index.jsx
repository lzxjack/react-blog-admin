// import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import './index.css';

const ArtList = props => {
    return (
        <div className="ArtList-box">
            {props.articles.map(item => (
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
        </div>
    );
};

export default connect(state => ({ articles: state.articles }), {})(ArtList);
