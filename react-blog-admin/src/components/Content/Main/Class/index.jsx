import { useState, useEffect } from 'react';
import { List, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { getClasses } from '../../../../redux/actions/classes';
import './index.css';

const Class = props => {
    const [classEditVisible, setClassEditVisible] = useState(false);
    return (
        <div className="ClassBox">
            <div className="homeSingleBox">分类</div>
            <div className="classCreateBox">
                <input type="text" placeholder="请输入新的分类..." className="classCreateInput" />
                <div className="classCreateBtn">新建</div>
            </div>
            <div className="classesList">
                <Modal
                    title="修改分类"
                    centered
                    visible={classEditVisible}
                    onOk={() => setClassEditVisible(false)}
                    onCancel={() => setClassEditVisible(false)}
                    width={400}
                    okText="确认"
                    cancelText="取消"
                >
                    <input type="text" className="editClassInput" />
                </Modal>
                <List
                    size="small"
                    bordered={false}
                    dataSource={props.classes}
                    renderItem={item => (
                        <List.Item className="classesItem">
                            <span style={{ fontSize: '16px' }}>{item}</span>
                            <EditOutlined
                                className="classesEdit"
                                onClick={() => {
                                    setClassEditVisible(true);
                                }}
                            />
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
