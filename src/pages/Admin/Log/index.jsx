import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Modal, notification, Table, Space, Button, Popconfirm, message, Popover } from 'antd';
import { FormOutlined, MessageOutlined, DeleteOutlined } from '@ant-design/icons';
import { db } from '../../../utils/cloudBase';
import { connect } from 'react-redux';
import { getLogs } from '../../../redux/actions';
import moment from 'moment';
import {
    emojiPeople,
    emojiNature,
    emojiObj,
    emojiPlace,
    emojiSymbol,
} from '../../../utils/constant';
import './index.css';

const Log = props => {
    // ————————————————————渲染事件表格————————————————————
    const [tableLoading, setTableLoading] = useState(false);
    // 表头
    const columns = [
        {
            title: '日期',
            dataIndex: 'date',
            key: '_id',
            sorter: (a, b) => a.date - b.date,
            render: text => <>{moment(text).format('YYYY-MM-DD')}</>,
            sortDirections: ['descend'],
            defaultSortOrder: ['ascend'],
        },
        {
            title: '事件内容',
            dataIndex: 'logContent',
            key: '_id',
            render: text => (
                <>
                    {text.map(item => (
                        <p key={nanoid()} className="tableContent">
                            {item}
                        </p>
                    ))}
                </>
            ),
        },
        {
            title: '操作',
            key: '_id',
            render: record => (
                <Space size="middle">
                    <Button type="primary" onClick={() => editLog(record._id)}>
                        修改
                    </Button>

                    <Popconfirm
                        placement="topRight"
                        title="确定要删除该事件吗？"
                        onConfirm={() => deleteLog(record._id)}
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
    // 获得所有事件
    const getAllLogs = () => {
        setTableLoading(true);
        db.collection('logs')
            .get()
            .then(res => {
                props.getLogs(res.data);
                setTableLoading(false);
            });
    };
    // ————————————————————渲染事件表格end————————————————————

    // ————————————————————————————添加/编辑事件对话框————————————————————————————
    const [addLogVisible, setAddLogVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    // 某条事件的详细数据
    const [id, setId] = useState('');
    const [date, setDate] = useState('');
    const [logContent, setLogContent] = useState([]);
    // 显示对话框
    const showAddLog = () => {
        setDate(moment().format('YYYY-MM-DD'));
        setAddLogVisible(true);
    };
    // 清空输入框
    const clearLogInput = () => {
        setId('');
        setLogContent([]);
        setDate('');
    };
    // 对话框确认
    const addLogOK = () => {
        if (!date) {
            message.info('请输入时间！');
            return;
        }
        if (logContent.length === 0) {
            message.info('请写点啥再添加！');
            return;
        }
        if (isEdit) {
            // 更新事件
            updateLog();
        } else {
            // 添加事件
            addLog();
        }
    };
    // 对话框取消
    const addLogCancel = () => {
        setAddLogVisible(false);
        // 清空输入框
        clearLogInput();
        setIsEdit(false);
    };
    // ————————————————————————————添加/编辑事件对话框end————————————————————————————

    // ——————————————————————————————对事件的操作————————————————————————————
    // 事件添加或更新后的操作
    const afterLogChange = isEdit => {
        const message = isEdit ? '更新事件成功' : '添加事件成功';
        const icon = isEdit ? (
            <FormOutlined style={{ color: 'blue' }} />
        ) : (
            <MessageOutlined style={{ color: 'blue' }} />
        );
        // 获取所有事件
        getAllLogs();
        addLogCancel();
        notification.open({
            message,
            icon,
            placement: 'bottomLeft',
            duration: 1.5,
        });
    };
    // 发送添加事件请求
    const addLog = () => {
        db.collection('logs')
            .add({
                date: new Date(date).getTime(),
                logContent,
            })
            .then(() => {
                // 添加后的操作
                afterLogChange(0);
            });
    };
    // 发送更新事件请求
    const updateLog = () => {
        db.collection('logs')
            .doc(id)
            .update({
                date: new Date(date).getTime(),
                logContent,
            })
            .then(() => {
                // 更新后的操作
                afterLogChange(1);
            });
    };
    // 点击编辑，根据ID获得事件详情
    const editLog = ID => {
        setId(ID);
        setIsEdit(true);
        setAddLogVisible(true);
        const logObj = props.logs.filter(item => item._id === ID)[0];
        const { date, logContent } = logObj;
        setDate(moment(date).format('YYYY-MM-DD'));
        setLogContent(logContent);
    };
    // 删除事件
    const deleteLog = ID => {
        db.collection('logs')
            .doc(ID)
            .remove()
            .then(() => {
                getAllLogs();
                notification.open({
                    message: '删除事件成功',
                    icon: <DeleteOutlined style={{ color: 'blue' }} />,
                    placement: 'bottomLeft',
                    duration: 1.5,
                });
            });
    };
    // ——————————————————————————————对事件的操作end————————————————————————————

    return (
        <>
            <div className="searchBox">
                <div type="primary" className="addLinkBtn" onClick={showAddLog}>
                    添加事件
                </div>
                <Modal
                    title={isEdit ? '更新事件' : '添加事件'}
                    visible={addLogVisible}
                    onOk={addLogOK}
                    onCancel={addLogCancel}
                >
                    <div className="logInputBox">
                        <div className="modalInputBox marginBottom">
                            <div className="modalInputKey logInputKey">时间：</div>
                            <input
                                className="modalInputValue"
                                type="text"
                                value={date}
                                onChange={e => {
                                    setDate(e.target.value);
                                }}
                            />
                        </div>
                        <div className="modalInputBox logTextarea">
                            <div className="modalInputKey logInputKey">事件：</div>
                            <div className="logInputValue">
                                <textarea
                                    className="logContent"
                                    type="text"
                                    placeholder="请输入事件，回车分隔"
                                    value={logContent.join(`\n`)}
                                    onChange={e => {
                                        setLogContent(e.target.value.split(`\n`));
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
                dataSource={props.logs}
                rowKey={columns => columns._id}
                showSorterTooltip={false}
            />
        </>
    );
};

export default connect(state => ({ logs: state.logs }), { getLogs })(Log);
