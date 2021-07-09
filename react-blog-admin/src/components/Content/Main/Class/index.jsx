import { useState, useEffect } from 'react';
import { List, Modal, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { getClasses } from '../../../../redux/actions/classes';
import { db } from '../../../../utils/cloudBase';
import './index.css';

const Class = props => {
    const [classEditVisible, setClassEditVisible] = useState(false);
    const [classInput, setClassInput] = useState('');
    const [classEditInput, setClassEditInput] = useState('');
    const [classId, setClassId] = useState('');

    // 向数据库获取所有分类
    const getAllClasses = () => {
        db.collection('classes')
            .get()
            .then(res => {
                props.getClasses(res.data);
            });
    };

    // 添加分类
    const addClass = () => {
        db.collection('classes')
            .add({
                class: classInput,
            })
            .then(() => {
                setClassInput('');
                message.success('添加标签成功！');
                getAllClasses();
            });
    };
    // 删除分类
    const deleteClass = id => {
        db.collection('classes')
            .doc(id)
            .remove()
            .then(() => {
                message.success('删除分类成功！');
                getAllClasses();
            });
    };
    // 对话框取消
    const classEditCancel = () => {
        setClassEditVisible(false);
        setClassInput('');
        setClassId('');
    };
    // 编辑分类
    const editClass = () => {
        db.collection('classes')
            .doc(classId)
            .update({
                class: classEditInput,
            })
            .then(() => {
                message.success('修改分类成功！');
                setClassEditVisible(false);
                getAllClasses();
                setClassId('');
            });
    };
    // 双击标签，打开标签对话框
    const openEditModal = (id, oldClass) => {
        setClassEditInput(oldClass);
        setClassId(id);
        setClassEditVisible(true);
    };
    return (
        <div className="ClassBox">
            <div className="homeSingleBox">分类</div>
            <div className="classCreateBox">
                <input
                    type="text"
                    placeholder="请输入新的分类..."
                    className="classCreateInput"
                    value={classInput}
                    onKeyUp={e => {
                        if (e.keyCode === 13) addClass();
                    }}
                    onChange={e => setClassInput(e.target.value)}
                />
                <div className="classCreateBtn" onClick={addClass}>
                    新建
                </div>
            </div>
            <div className="classesList">
                <Modal
                    title="修改分类"
                    centered
                    visible={classEditVisible}
                    onOk={editClass}
                    onCancel={classEditCancel}
                    width={400}
                    okText="确认"
                    cancelText="取消"
                >
                    <input
                        type="text"
                        className="editClassInput"
                        value={classEditInput}
                        onChange={e => setClassEditInput(e.target.value)}
                        onKeyUp={e => {
                            if (e.keyCode === 13) editClass();
                        }}
                    />
                </Modal>
                <List
                    size="small"
                    bordered={false}
                    dataSource={props.classes}
                    renderItem={item => (
                        <List.Item className="classesItem">
                            <span style={{ fontSize: '16px' }}>《{item.class}》</span>
                            <EditOutlined
                                className="classesEdit"
                                onClick={() => openEditModal(item._id, item.class)}
                            />
                            <Popconfirm
                                placement="top"
                                title="确定要删除该分类吗？"
                                onConfirm={() => deleteClass(item._id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <DeleteOutlined className="classesDelete" />
                            </Popconfirm>
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
