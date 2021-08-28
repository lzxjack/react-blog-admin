import { useState } from 'react';
import { Popconfirm, Modal, message } from 'antd';
import { connect } from 'react-redux';
import { CloseOutlined } from '@ant-design/icons';
import { getTags, getArticles, getDrafts } from '../../../../redux/actions';
import { db, _, auth } from '../../../../utils/cloudBase';
import { visitorText, adminUid } from '../../../../utils/constant';
import './index.css';

const MyTag = props => {
    const tagColor = [
        'rgb(236, 17, 17)',
        'rgb(236, 141, 17)',
        'rgb(177, 174, 11)',
        'rgb(116, 115, 109)',
        'rgb(77, 75, 65)',
        'rgb(35, 207, 50)',
        'rgb(38, 204, 162)',
        'rgb(11, 156, 120)',
        'rgb(4, 187, 211)',
        'rgb(7, 133, 206)',
        'rgb(7, 64, 151)',
        'rgb(9, 24, 235)',
        'rgb(157, 160, 212)',
        'rgb(144, 76, 235)',
        'rgb(209, 76, 235)',
        'rgb(224, 19, 224)',
        'rgb(238, 45, 126)',
        'rgb(253, 48, 65)',
        '#f50',
        '#2db7f5',
        '#87d068',
        '#108ee9',
    ];
    const colorLen = tagColor.length;
    const [tagEditVisible, setTagEditVisible] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [tagEditInput, setTagEditInput] = useState('');
    const [oldTag, setOldTag] = useState('');
    const [tagId, setTagId] = useState('');

    // 数据库获取所有标签
    const getAllTags = () => {
        db.collection('tags')
            .get()
            .then(res => {
                props.getTags(res.data);
            });
    };
    const getAllArticles = dbName => {
        db.collection(dbName)
            .get()
            .then(res => {
                if (dbName === 'articles') {
                    props.getArticles(res.data);
                    message.success('更新文章标签成功！');
                } else {
                    props.getDrafts(res.data);
                    message.success('更新草稿标签成功！');
                }
            });
    };
    // 清空ID、编辑输入框、旧标签名
    const clearAllState = () => {
        setTagEditInput('');
        setOldTag('');
        setTagId('');
    };
    // 添加标签
    const addTag = async () => {
        if (!tagInput.length) {
            message.info('标签名不能为空！');
            return;
        }
        // 判断是否存在
        const sameTagName = props.tags.filter(item => item.tag === tagInput);
        // 如果标签存在，直接返回
        if (sameTagName.length) {
            message.warning('该标签已存在！');
            return;
        }
        if (auth.currentUser.uid !== adminUid) {
            message.warning(visitorText);
            return;
        }
        db.collection('tags')
            .add({
                tag: tagInput,
            })
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                    message.warning(visitorText);
                    return;
                }
                setTagInput('');
                message.success('添加标签成功！');
                getAllTags();
            });
    };
    const deleteTagFrom = (dbName, theTag) => {
        if (auth.currentUser.uid !== adminUid) {
            message.warning(visitorText);
            return;
        }
        // const text = dbName === 'articles' ? '文章' : '草稿';
        db.collection(dbName)
            .where({
                tags: _.all([theTag]),
            })
            .update({
                tags: _.pull(theTag),
            })
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') return;
                getAllArticles(dbName);
            });
    };
    // 删除标签
    const deleteTag = (id, theTag) => {
        if (auth.currentUser.uid !== adminUid) {
            message.warning(visitorText);
            return;
        }
        // 删除标签数据库中的标签
        db.collection('tags')
            .doc(id)
            .remove()
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                    message.warning(visitorText);
                    return;
                }
                message.success('删除标签成功！');
                getAllTags();
            });
        // 删除该标签下所有文章的相应标签
        deleteTagFrom('articles', theTag);
        // 删除该标签下所有草稿的相应标签
        deleteTagFrom('drafts', theTag);
    };
    const editTagFrom = async dbName => {
        if (auth.currentUser.uid !== adminUid) {
            message.warning(visitorText);
            return;
        }
        // 修改该标签下所有文章的相应标签,分两步:
        // （1）在有该便签的所有文章下，添加修改后的标签
        // const text = dbName === 'articles' ? '文章' : '草稿';
        await db
            .collection(dbName)
            .where({
                tags: _.all([oldTag]),
            })
            .update({
                tags: _.addToSet(tagEditInput),
            })
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') return;
            });
        // （2）在有该便签的所有文章下，删除该标签
        db.collection(dbName)
            .where({
                tags: _.all([oldTag]),
            })
            .update({
                tags: _.pull(oldTag),
            })
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') return;
                // message.success(`更新${text}标签成功！`);
                getAllArticles(dbName);
            });
    };
    // 对话框确认：编辑标签
    const editTag = async () => {
        // 判断是否存在
        const sameTagName = props.tags.filter(item => item.tag === tagEditInput);
        // 如果标签存在，直接返回
        if (sameTagName.length) {
            message.warning('该标签已存在！');
            return;
        }
        if (auth.currentUser.uid !== adminUid) {
            message.warning(visitorText);
            return;
        }
        // 修改标签数据库中的标签
        db.collection('tags')
            .doc(tagId)
            .update({
                tag: tagEditInput,
            })
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                    message.warning(visitorText);
                    return;
                }
                message.success('修改标签成功！');
                setTagEditVisible(false);
                getAllTags();
                clearAllState();
            });
        editTagFrom('articles');
        editTagFrom('drafts');
    };
    // 双击标签，打开标签对话框
    const openEditModal = (id, theTag) => {
        setTagEditInput(theTag);
        setOldTag(theTag);
        setTagId(id);
        setTagEditVisible(true);
    };
    // 对话框取消
    const tagEditCancel = () => {
        setTagEditVisible(false);
        clearAllState();
    };
    return (
        <div className="MyTagBox">
            <div className="homeSingleBox">标签</div>
            <div className="classCreateBox">
                <input
                    type="text"
                    placeholder="请输入新的标签..."
                    className="classCreateInput"
                    onKeyUp={e => {
                        if (e.keyCode === 13) addTag();
                    }}
                    value={tagInput}
                    onChange={e => {
                        setTagInput(e.target.value);
                    }}
                />
                <div className="classCreateBtn" onClick={addTag}>
                    新建
                </div>
            </div>
            <div className="classesList tagsList">
                <Modal
                    title="修改标签"
                    centered
                    visible={tagEditVisible}
                    onOk={editTag}
                    onCancel={tagEditCancel}
                    width={400}
                    okText="确认"
                    cancelText="取消"
                >
                    <input
                        type="text"
                        className="editClassInput"
                        value={tagEditInput}
                        onChange={e => setTagEditInput(e.target.value)}
                        onKeyUp={e => {
                            if (e.keyCode === 13) editTag();
                        }}
                    />
                </Modal>
                {props.tags.map((item, index) => (
                    <span
                        className="theTag"
                        style={{ backgroundColor: tagColor[(index + 1) % colorLen] }}
                        onDoubleClick={() => openEditModal(item._id, item.tag)}
                        key={item._id}
                    >
                        {item.tag}
                        <Popconfirm
                            placement="top"
                            title="确定要删除该标签吗？"
                            onConfirm={() => deleteTag(item._id, item.tag)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <CloseOutlined className="deleteTagBtn" />
                        </Popconfirm>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default connect(
    state => ({
        tags: state.tags,
    }),
    {
        getTags,
        getArticles,
        getDrafts,
    }
)(MyTag);
