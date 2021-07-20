// import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Pagination } from 'antd';
import { getCurPage } from '../../../redux/actions';
import { pageSize } from '../../../utils/constant';
import './index.css';

const PageNav = props => {
    return (
        <div className="PageNav-box">
            <Pagination
                current={props.curPage}
                total={props.articleNum}
                defaultPageSize={pageSize}
                showSizeChanger={false}
                showTitle={false}
                onChange={page => props.getCurPage(page)}
            />
        </div>
    );
};

export default connect(
    state => ({
        curPage: state.curPage,
        articleNum: state.articles.length,
    }),
    {
        getCurPage,
    }
)(PageNav);
