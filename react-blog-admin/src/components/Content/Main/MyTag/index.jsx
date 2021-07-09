import { useState, useEffect } from 'react';
import { Popconfirm, Modal, message } from 'antd';
import { connect } from 'react-redux';
import { CloseOutlined } from '@ant-design/icons';
import { getTags } from '../../../../redux/actions/tags';
import { db } from '../../../../utils/cloudBase';
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
    const [isMounted, setIsMounted] = useState(true);
    const [tags, setTags] = useState([]);
    const [tagEditVisible, setTagEditVisible] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [tagEditInput, setTagEditInput] = useState('');
    const [tagId, setTagId] = useState('');

    // 数据库获取所有标签
    const getAllTags = () => {
        db.collection('tags')
            .get()
            .then(res => {
                setTags(res.data);
            });
    };
    // 组件挂载，获取一次所有标签
    useEffect(() => {
        isMounted && getAllTags();
        return () => {
            setIsMounted(false);
        };
    }, [isMounted]);
    // 添加标签
    const addTag = () => {
        db.collection('tags')
            .add({
                tag: tagInput,
            })
            .then(() => {
                setTagInput('');
                message.success('添加标签成功！');
                getAllTags();
            });
    };
    // 删除标签
    const deleteTag = id => {
        db.collection('tags')
            .doc(id)
            .remove()
            .then(() => {
                message.success('删除标签成功！');
                getAllTags();
            });
    };
    // 编辑标签
    const editTag = () => {
        db.collection('tags')
            .doc(tagId)
            .update({
                tag: tagEditInput,
            })
            .then(() => {
                message.success('修改标签成功！');
                setTagEditVisible(false);
                getAllTags();
                setTagId('');
            });
    };
    // 双击标签，打开标签对话框
    const openEditModal = (id, oldTag) => {
        setTagEditInput(oldTag);
        setTagId(id);
        setTagEditVisible(true);
    };
    // 对话框取消
    const tagEditCancel = () => {
        setTagEditVisible(false);
        setTagEditInput('');
        setTagId('');
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
                {tags.map((item, index) => (
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
                            onConfirm={() => deleteTag(item._id)}
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
    }
)(MyTag);
