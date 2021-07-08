import { useState, useEffect } from 'react';
import { List } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { getClasses } from '../../../../redux/actions/classes';
import './index.css';

const Class = props => {
    return (
        <div className="ClassBox">
            <div className="homeSingleBox">分类</div>
            <div className="classCreateBox">
                <input type="text" placeholder="请输入新的分类..." className="classCreateInput" />
                <div className="classCreateBtn">新建</div>
            </div>
            <div className="classesList">
                <List
                    size="small"
                    bordered={false}
                    dataSource={props.classes}
                    renderItem={item => (
                        <List.Item className="classesItem">
                            <span style={{ fontSize: '16px' }}>{item}</span>
                            <EditOutlined className="classesEdit" />
                            <DeleteOutlined className="classesDelete" />
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default connect(
    state => ({
        classes: state.classes,
    }),
    {
        getClasses,
    }
)(Class);
