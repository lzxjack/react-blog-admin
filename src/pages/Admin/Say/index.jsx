import { useState } from 'react';
import { connect } from 'react-redux';
import { Modal, notification, Table, Space, Button, Popconfirm, message, Popover } from 'antd';
import { FormOutlined, MessageOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { db, auth } from '../../../utils/cloudBase';
import { getSays } from '../../../redux/actions';
import {
    emojiPeople,
    emojiNature,
    emojiObj,
    emojiPlace,
    emojiSymbol,
    visitorText,
    adminUid,
} from '../../../utils/constant';
import './index.css';

const Say = props => {
    // ————————————————————渲染说说表格————————————————————
    const [tableLoading, setTableLoading] = useState(false);
    // 表头
    const columns = [
        {
            title: '说说内容',
            dataIndex: 'content',
            key: '_id',
            width: '1200px',
            render: text => <p className="msgs-content">{text}</p>,
        },
        {
            title: '发布日期',
            dataIndex: 'date',
            key: '_id',
            sorter: (a, b) => a.date - b.date,
            render: text => <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>,
            sortDirections: ['descend'],
            defaultSortOrder: ['ascend'],
        },
        {
            title: '操作',
            key: '_id',
            render: record => (
                <Space size="middle">
                    <Button type="primary" onClick={() => editSay(record._id)}>
                        修改
                    </Button>

                    <Popconfirm
                        placement="topRight"
                        title="确定要删除该说说吗？"
                        onConfirm={() => deleteSay(record._id)}
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
    // 获得所有说说
    const getAllSays = () => {
        setTableLoading(true);
        db.collection('says')
            .limit(1000)
            .get()
            .then(res => {
                props.getSays(res.data);
                setTableLoading(false);
            });
    };
    // ————————————————————渲染说说表格end————————————————————

    // ————————————————————————————添加/编辑说说对话框————————————————————————————
    const [addSayVisible, setAddSayVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    // 某条说说的详细数据
    const [id, setId] = useState('');
    const [date, setDate] = useState('');
    const [content, setContent] = useState('');
    // 显示对话框
    const showAddSay = () => {
        setAddSayVisible(true);
    };
    // 清空输入框
    const clearSayInput = () => {
        setId('');
        setDate('');
        setContent('');
    };
    // 对话框确认
    const addSayOK = () => {
        if (!content) {
            message.info('请说点啥再发表！');
            return;
        }
        if (auth.currentUser.uid !== adminUid) {
            message.warning(visitorText);
            return;
        }
        if (isEdit) {
            // 更新说说
            updateSay();
        } else {
            // 添加说说
            addSay();
        }
    };
    // 对话框取消
    const addSayCancel = () => {
        setAddSayVisible(false);
        clearSayInput();
        setIsEdit(false);
    };
    // ————————————————————————————添加/编辑说说对话框end————————————————————————————

    // ——————————————————————————————对说说的操作————————————————————————————
    // 说说添加或更新后的操作
    const afterSayChange = isEdit => {
        const message = isEdit ? '更新说说成功' : '发表说说成功';
        const icon = isEdit ? (
            <FormOutlined style={{ color: 'blue' }} />
        ) : (
            <MessageOutlined style={{ color: 'blue' }} />
        );
        // 获取所有说说
        getAllSays();
        addSayCancel();
        notification.open({
            message,
            icon,
            placement: 'bottomLeft',
            duration: 1.5,
        });
    };
    // 发送添加说说请求
    const addSay = () => {
        db.collection('says')
            .add({
                content,
                date: new Date().getTime(),
            })
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                    message.warning(visitorText);
                    return;
                }
                // 添加后的操作
                afterSayChange(0);
            });
    };
    // 发送更新说说请求
    const updateSay = () => {
        db.collection('says')
            .doc(id)
            .update({
                content,
                date,
            })
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                    message.warning(visitorText);
                    return;
                }
                // 更新后的操作
                afterSayChange(1);
            });
    };
    // 点击编辑，根据ID获得说说详情
    const editSay = ID => {
        setId(ID);
        setIsEdit(true);
        setAddSayVisible(true);
        const sayObj = props.says.filter(item => item._id === ID)[0];
        const { content, date } = sayObj;
        setContent(content);
        setDate(date);
    };
    // 删除说说
    const deleteSay = ID => {
        if (auth.currentUser.uid !== adminUid) {
            message.warning(visitorText);
            return;
        }
        db.collection('says')
            .doc(ID)
            .remove()
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                    message.warning(visitorText);
                    return;
                }
                getAllSays();
                notification.open({
                    message: '删除说说成功',
                    icon: <DeleteOutlined style={{ color: 'blue' }} />,
                    placement: 'bottomLeft',
                    duration: 1.5,
                });
            });
    };
    // ——————————————————————————————对说说的操作end————————————————————————————

    return (
        <>
            <div className="searchBox">
                <div type="primary" className="addLinkBtn" onClick={showAddSay}>
                    发表说说
                </div>
                <Modal
                    title={isEdit ? '更新说说' : '发表说说'}
                    visible={addSayVisible}
                    // style={{ top: 60 }}
                    // width={900}
                    onOk={addSayOK}
                    onCancel={addSayCancel}
                >
                    <div className="sayInputBox">
                        <textarea
                            className="sayInputText"
                            type="text"
                            value={content}
                            onChange={e => {
                                setContent(e.target.value);
                            }}
                        />
                        <Popover
                            className="emojiBtn"
                            overlayClassName="emojiContent"
                            placement="bottom"
                            content={emojiPeople}
                            trigger="click"
                        >
                            <Button>😄</Button>
                        </Popover>
                        <Popover
                            className="emojiBtn"
                            overlayClassName="emojiContent"
                            placement="bottom"
                            content={emojiNature}
                            trigger="click"
                        >
                            <Button>☀️</Button>
                        </Popover>
                        <Popover
                            className="emojiBtn"
                            overlayClassName="emojiContent"
                            placement="bottom"
                            content={emojiObj}
                            trigger="click"
                        >
                            <Button>🏀</Button>
                        </Popover>
                        <Popover
                            className="emojiBtn"
                            overlayClassName="emojiContent"
                            placement="bottom"
                            content={emojiPlace}
                            trigger="click"
                        >
                            <Button>⛪</Button>
                        </Popover>
                        <Popover
                            className="emojiBtn"
                            overlayClassName="emojiContent"
                            placement="bottom"
                            content={emojiSymbol}
                            trigger="click"
                        >
                            <Button>🆗</Button>
                        </Popover>
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
                dataSource={props.says}
                rowKey={columns => columns._id}
                showSorterTooltip={false}
            />
        </>
    );
};

export default connect(state => ({ says: state.says }), { getSays })(Say);
