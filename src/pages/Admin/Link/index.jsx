import { useState } from 'react';
import { Modal, notification, Table, Space, Button, Popconfirm, message } from 'antd';
import { UserOutlined, DeleteOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { getLinks } from '../../../redux/actions';
import { db, auth } from '../../../utils/cloudBase';
import { visitorText, adminUid } from '../../../utils/constant';
import './index.css';

const Link = props => {
    // ——————————————————————————————渲染友链表格————————————————————————————
    const [tableLoading, setTableLoading] = useState(false);
    // 表头
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: '_id',
            render: text => <strong>{text}</strong>,
        },
        {
            title: 'Link',
            dataIndex: 'link',
            key: '_id',
            render: text => (
                <a href={text} target="_blank" rel="noreferrer">
                    {text}
                </a>
            ),
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: '_id',
        },
        {
            title: 'Descr',
            dataIndex: 'descr',
            key: '_id',
        },
        {
            title: '操作',
            key: '_id',
            render: record => (
                <Space size="middle">
                    <Button type="primary" onClick={() => editLink(record._id)}>
                        修改
                    </Button>

                    <Popconfirm
                        placement="topRight"
                        title="确定要删除该友链吗？"
                        onConfirm={() => deleteLink(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    // 获取所有友链数据，放入redux
    const getLinksData = () => {
        setTableLoading(true);
        db.collection('links')
            .get()
            .then(res => {
                props.getLinks(res.data);
                setTableLoading(false);
            });
    };
    // ——————————————————————————————渲染友链表格end————————————————————————————

    // ————————————————————————————添加/编辑友链对话框————————————————————————————
    const [addLinkVisible, setAddLinkVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    // 某条友链的详细数据
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [avatar, setAvatar] = useState('');
    const [descr, setDescr] = useState('');
    // 展示添加友链的页面
    const showAddLink = () => {
        setAddLinkVisible(true);
    };
    // 对话框确认
    const addLinkOK = () => {
        if (!name || !link || !avatar || !descr) {
            message.info('请输入完整友链信息！');
            return;
        }
        if (auth.currentUser.uid !== adminUid) {
            message.warning(visitorText);
            return;
        }
        if (isEdit) {
            // 更新友链
            updateLink();
        } else {
            // 添加友链
            addLink();
        }
    };
    // 清空所有输入框
    const clearLinkInput = () => {
        setId('');
        setName('');
        setLink('');
        setAvatar('');
        setDescr('');
    };
    // 对话框取消
    const addLinkCancel = () => {
        setAddLinkVisible(false);
        clearLinkInput();
        setIsEdit(false);
    };
    // ————————————————————————————添加/编辑友链对话框end————————————————————————————

    // ——————————————————————————————对友链的操作————————————————————————————

    // 友链添加或更新后的操作
    const afterLinkChange = isEdit => {
        const message = isEdit ? '更新友链成功' : '添加友链成功';
        const icon = isEdit ? (
            <UserSwitchOutlined style={{ color: 'blue' }} />
        ) : (
            <UserOutlined style={{ color: 'blue' }} />
        );
        // 获取所有友链
        getLinksData();
        addLinkCancel();
        notification.open({
            message,
            icon,
            placement: 'bottomLeft',
            duration: 1.5,
        });
    };
    // 发送添加友链请求
    const addLink = () => {
        // 添加友链
        db.collection('links')
            .add({
                name,
                link,
                avatar,
                descr,
            })
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                    message.warning(visitorText);
                    return;
                }
                afterLinkChange(0);
            });
    };
    // 发送更新友链请求
    const updateLink = () => {
        // 修改友链
        db.collection('links')
            .doc(id)
            .update({
                name,
                link,
                avatar,
                descr,
            })
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                    message.warning(visitorText);
                    return;
                }
                afterLinkChange(1);
            });
    };
    // 点击编辑友链，获取该友链信息
    const editLink = ID => {
        setId(ID);
        setIsEdit(true);
        setAddLinkVisible(true);
        const linkObj = props.links.filter(item => item._id === ID)[0];
        const { name, link, avatar, descr } = linkObj;
        setName(name);
        setLink(link);
        setAvatar(avatar);
        setDescr(descr);
    };
    // 删除友链
    const deleteLink = id => {
        if (auth.currentUser.uid !== adminUid) {
            message.warning(visitorText);
            return;
        }
        db.collection('links')
            .doc(id)
            .remove()
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                    message.warning(visitorText);
                    return;
                }
                getLinksData();
                notification.open({
                    message: '删除友链成功',
                    icon: <DeleteOutlined style={{ color: 'blue' }} />,
                    placement: 'bottomLeft',
                    duration: 1.5,
                });
            });
    };
    // ——————————————————————————————对友链的操作end————————————————————————————

    return (
        <>
            <div className="searchBox">
                <div type="primary" className="addLinkBtn" onClick={showAddLink}>
                    添加友链
                </div>
                <Modal
                    title={isEdit ? '修改友链' : '添加友链'}
                    visible={addLinkVisible}
                    onOk={addLinkOK}
                    onCancel={addLinkCancel}
                >
                    <div className="linkInputBox">
                        <div className="modalInputBox">
                            <div className="modalInputKey">name：</div>
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
                            <div className="modalInputKey">link：</div>
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
                            <div className="modalInputKey">avatar：</div>
                            <input
                                className="modalInputValue"
                                type="text"
                                value={avatar}
                                onChange={e => {
                                    setAvatar(e.target.value);
                                }}
                            />
                        </div>
                        <div className="modalInputBox">
                            <div className="modalInputKey">descr：</div>
                            <input
                                className="modalInputValue"
                                type="text"
                                value={descr}
                                onChange={e => {
                                    setDescr(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </Modal>
            </div>
            <Table
                size="middle"
                className="Table"
                bordered
                loading={tableLoading}
                pagination={{
                    position: ['bottomCenter'],
                    defaultPageSize: 11,
                    hideOnSinglePage: true,
                    showTitle: false,
                    size: ['small'],
                }}
                columns={columns}
                dataSource={props.links}
                rowKey={columns => columns._id}
                showSorterTooltip={false}
            />
        </>
    );
};

export default connect(state => ({ links: state.links }), { getLinks })(Link);
