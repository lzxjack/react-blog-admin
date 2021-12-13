import { useState } from 'react';
import { Modal, message, notification, Popconfirm } from 'antd';
import { PictureOutlined, FormOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { getShows } from '../../../redux/actions';
import { db, auth } from '../../../utils/cloudBase';
import { visitorText, adminUid } from '../../../utils/constant';
import './index.css';

const Show = props => {
    // 获得所有作品信息
    const getAllShows = () => {
        db.collection('shows')
            .limit(1000)
            .get()
            .then(res => {
                res.data.sort((a, b) => a.order - b.order);
                props.getShows(res.data);
            });
    };
    const [showVisible, setShowVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [descr, setDescr] = useState('');
    const [cover, setCover] = useState('');
    const [link, setLink] = useState('');
    const [order, setOrder] = useState('');

    // 编辑/添加成功后的操作
    const afterShowChange = isEdit => {
        // 获取所有相册
        getAllShows();
        galleryCancel();
        const message = isEdit ? '修改作品成功' : '添加作品成功';
        const icon = isEdit ? (
            <EditOutlined style={{ color: 'blue' }} />
        ) : (
            <PictureOutlined style={{ color: 'blue' }} />
        );
        notification.open({
            message,
            icon,
            placement: 'bottomLeft',
            duration: 1.5,
        });
    };
    // 对话框确认
    const galleryOK = () => {
        if (!name || !descr || !cover || !link) {
            message.info('请输入完整作品信息！');
            return;
        }
        if (auth.currentUser.uid !== adminUid) {
            message.warning(visitorText);
            return;
        }
        if (isEdit) {
            // 编辑
            db.collection('shows')
                .doc(id)
                .update({
                    name,
                    descr,
                    cover,
                    link,
                    order,
                })
                .then(res => {
                    if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                        message.warning(visitorText);
                        return;
                    }
                    afterShowChange(1);
                });
        } else {
            // 添加
            db.collection('shows')
                .add({
                    name,
                    descr,
                    cover,
                    link,
                    order,
                })
                .then(res => {
                    if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                        message.warning(visitorText);
                        return;
                    }
                    afterShowChange(0);
                });
        }
    };
    // 对话框取消
    const galleryCancel = () => {
        clearShowInput();
        setShowVisible(false);
        setIsEdit(false);
    };
    // 清除对话框的输入框
    const clearShowInput = () => {
        setId('');
        setName('');
        setDescr('');
        setCover('');
        setLink('');
        setOrder('');
    };
    // 编辑作品
    const editShow = ID => {
        setId(ID);
        // 打开对话框
        setShowVisible(true);
        // 打开编辑状态
        setIsEdit(true);
        const showObj = props.shows.filter(item => item._id === ID)[0];
        const { name, descr, cover, link, order } = showObj;
        setName(name);
        setDescr(descr);
        setCover(cover);
        setLink(link);
        setOrder(order);
    };
    // 删除作品
    const deleteShow = ID => {
        if (auth.currentUser.uid !== adminUid) {
            message.warning(visitorText);
            return;
        }
        db.collection('shows')
            .doc(ID)
            .remove()
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                    message.warning(visitorText);
                    return;
                }
                // 获取所有相册
                getAllShows();
                notification.open({
                    message: '删除作品成功',
                    icon: <DeleteOutlined style={{ color: 'blue' }} />,
                    placement: 'bottomLeft',
                    duration: 1.5,
                });
            });
    };
    return (
        <>
            <div className="addGalleryBox">
                <div
                    className="addGalleryBtn"
                    onClick={() => {
                        setShowVisible(true);
                    }}
                >
                    添加作品
                </div>
                <Modal
                    title="添加作品"
                    visible={showVisible}
                    onOk={galleryOK}
                    onCancel={galleryCancel}
                >
                    <div className="linkInputBox">
                        <div className="modalInputBox">
                            <div className="modalInputKey showInputKey">名称：</div>
                            <input
                                className="modalInputValue"
                                type="text"
                                value={name}
                                onChange={e => {
                                    setName(e.target.value);
                                }}
                            />
                        </div>
                        <div className="modalInputBox">
                            <div className="modalInputKey showInputKey">描述：</div>
                            <input
                                className="modalInputValue"
                                type="text"
                                value={descr}
                                onChange={e => {
                                    setDescr(e.target.value);
                                }}
                            />
                        </div>
                        <div className="modalInputBox">
                            <div className="modalInputKey showInputKey">封面：</div>
                            <input
                                className="modalInputValue"
                                type="text"
                                value={cover}
                                onChange={e => {
                                    setCover(e.target.value);
                                }}
                            />
                        </div>
                        <div className="modalInputBox">
                            <div className="modalInputKey showInputKey">链接：</div>
                            <input
                                className="modalInputValue"
                                type="text"
                                value={link}
                                onChange={e => {
                                    setLink(e.target.value);
                                }}
                            />
                        </div>
                        <div className="modalInputBox">
                            <div className="modalInputKey showInputKey">序号：</div>
                            <input
                                className="modalInputValue"
                                type="text"
                                value={order}
                                onChange={e => {
                                    setOrder(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </Modal>
            </div>
            <div className="galleryBox">
                <ul className="galleryUl">
                    {props.shows.map(item => (
                        <li key={item._id} style={{ backgroundImage: `url(${item.cover})` }}>
                            <div className="galleryTitleBox">
                                <span>
                                    <a
                                        href={item.link}
                                        rel="noreferrer"
                                        target="_blank"
                                        className="showLink"
                                    >
                                        {item.name}
                                    </a>
                                </span>
                            </div>
                            <div className="showOrder">{item.order}</div>
                            <div className="galleryDescr">{item.descr}</div>
                            <div className="galleryMask"></div>
                            <FormOutlined
                                className="showEditBtn"
                                onClick={() => {
                                    editShow(item._id);
                                }}
                            />
                            <Popconfirm
                                placement="topRight"
                                title="确定要删除该作品吗？"
                                onConfirm={() => {
                                    deleteShow(item._id);
                                }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <DeleteOutlined className="showDeleteBtn" />
                            </Popconfirm>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default connect(state => ({ shows: state.shows }), { getShows })(Show);
