import { useState } from 'react';
import { List, Modal, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { getClasses, getArticles } from '../../../../redux/actions';
import { db, auth } from '../../../../utils/cloudBase';
import { visitorText, adminUid } from '../../../../utils/constant';
import './index.css';

const Class = props => {
    const [classEditVisible, setClassEditVisible] = useState(false);
    const [classInput, setClassInput] = useState('');
    const [classEditInput, setClassEditInput] = useState('');
    const [classId, setClassId] = useState('');
    const [oldClass, setOldClass] = useState('');

    // 获取最新所有文章，并放入redux
    const getNewArticles = () => {
        db.collection('articles')
            .get()
            .then(res => {
                props.getArticles(res.data);
            });
    };
    // 向数据库获取所有分类
    const getAllClasses = () => {
        db.collection('classes')
            .get()
            .then(res => {
                props.getClasses(res.data);
                getNewArticles();
            });
    };
    // 添加分类
    const addClass = async () => {
        if (!classInput.length) {
            message.info('分类名不能为空！');
            return;
        }
        // 判断是否存在
        const sameClassName = props.classes.filter(item => item.class === classInput);
        // 如果分类存在，直接返回
        if (sameClassName.length) {
            message.warning('该分类已存在！');
            return;
        }
        if (auth.currentUser.uid !== adminUid) {
            message.warning(visitorText);
            return;
        }
        db.collection('classes')
            .add({
                class: classInput,
                count: 0,
            })
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                    message.warning(visitorText);
                    return;
                }
                setClassInput('');
                message.success('添加分类成功！');
                getAllClasses();
            });
    };
    const deleteClassFrom = (dbName, theClass) => {
        if (auth.currentUser.uid !== adminUid) return;
        const text = dbName === 'articles' ? '文章' : '草稿';
        db.collection(dbName)
            .where({ classes: theClass })
            .update({
                classes: '',
            })
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') return;
                message.success(`更新${text}分类成功！`);
            });
    };
    // 删除分类
    const deleteClass = (id, theClass) => {
        if (auth.currentUser.uid !== adminUid) {
            message.warning(visitorText);
            return;
        }
        // 从分类数据库中删除该分类
        db.collection('classes')
            .doc(id)
            .remove()
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                    message.warning(visitorText);
                    return;
                }
                message.success('删除分类成功！');
                getAllClasses();
            });
        // 删除该分类下所有文章的分类属性
        deleteClassFrom('articles', theClass);
        // 删除该分类下所有草稿的分类属性
        deleteClassFrom('drafts', theClass);
    };
    // 清空ID、编辑输入框、旧分类名
    const clearAllState = () => {
        setClassEditInput('');
        setOldClass('');
        setClassId('');
    };
    // 对话框取消
    const classEditCancel = () => {
        setClassEditVisible(false);
        clearAllState();
    };
    const editClassFrom = dbName => {
        if (auth.currentUser.uid !== adminUid) {
            message.warning(visitorText);
            return;
        }
        const text = dbName === 'articles' ? '文章' : '草稿';
        db.collection(dbName)
            .where({ classes: oldClass })
            .update({
                classes: classEditInput,
            })
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') return;
                message.success(`更新${text}分类成功！`);
            });
    };
    // 对话框确认：编辑分类
    const editClass = async () => {
        // 判断是否存在
        const sameClassName = props.classes.filter(item => item.class === classEditInput);
        // 如果分类存在，直接返回
        if (sameClassName.length) {
            message.warning('该分类已存在！');
            return;
        }
        if (auth.currentUser.uid !== adminUid) {
            message.warning(visitorText);
            return;
        }
        // 修改分类数据库中的数据
        db.collection('classes')
            .doc(classId)
            .update({
                class: classEditInput,
            })
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                    message.warning(visitorText);
                    return;
                }
                message.success('修改分类成功！');
                setClassEditVisible(false);
                getAllClasses();
                clearAllState();
            });
        // 修改该分类下所有文章的分类名
        editClassFrom('articles');
        // 修改该分类下所有草稿的分类名
        editClassFrom('drafts');
    };
    // 打开分类对话框
    const openEditModal = (id, oldClassName) => {
        setClassEditInput(oldClassName);
        setOldClass(oldClassName);
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
                            <span style={{ fontSize: '16px' }} className="className">
                                《{item.class}》
                            </span>
                            <div className="articlesNum">{item.count}</div>
                            <EditOutlined
                                className="classesEdit"
                                onClick={() => openEditModal(item._id, item.class)}
                            />
                            <Popconfirm
                                placement="top"
                                title="确定要删除该分类吗？"
                                onConfirm={() => deleteClass(item._id, item.class)}
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
        getArticles,
    }
)(Class);
