import { useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { db, auth } from '../../../utils/cloudBase';
import { getMsgs } from '../../../redux/actions';
import { message, Table, Space, Button, Popconfirm, notification } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { blogUrl, visitorText, adminUid } from '../../../utils/constant';
import './index.css';

const Msg = props => {
    const [tableLoading, setTableLoading] = useState(false);

    const getAllMsgs = () => {
        setTableLoading(true);
        db.collection('allComments')
            .limit(1000)
            .get()
            .then(res => {
                props.getMsgs(res.data);
                setTableLoading(false);
            });
    };
    const deleteMsg = Id => {
        if (auth.currentUser.uid !== adminUid) {
            message.warning(visitorText);
            return;
        }
        db.collection('allComments')
            .doc(Id)
            .remove()
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                    message.warning(visitorText);
                    return;
                }
                getAllMsgs();
                // 删除成功，提示消息
                notification.open({
                    message: '删除成功',
                    icon: <DeleteOutlined style={{ color: 'blue' }} />,
                    placement: 'bottomLeft',
                    duration: 1.5,
                });
            });
    };
    // 表头
    const columns = [
        {
            title: '昵称',
            dataIndex: 'name',
            key: '_id',
            render: text => <strong>{text === '飞鸟' ? '飞鸟📌' : text}</strong>,
        },
        {
            title: '联系邮箱',
            dataIndex: 'email',
            key: '_id',
        },
        {
            title: '网址',
            dataIndex: 'link',
            key: '_id',
            render: text => (
                <a href={text} target="_blank" rel="noreferrer">
                    {text}
                </a>
            ),
        },
        {
            title: '日期',
            dataIndex: 'date',
            key: '_id',
            sorter: (a, b) => a.date - b.date,
            render: text => <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>,
            sortDirections: ['descend'],
            defaultSortOrder: ['ascend'],
        },
        {
            title: '类型',
            key: '_id',
            render: record => (
                <>
                    {record.postTitle
                        ? record.replyId
                            ? '文章评论「回复」'
                            : '文章评论'
                        : record.replyId
                        ? '留言板「回复」'
                        : '留言板'}
                </>
            ),
        },
        {
            title: '内容',
            dataIndex: 'content',
            key: '_id',
            width: '400px',
            render: text => <p className="msgs-content">{text}</p>,
        },
        {
            title: '操作',
            key: '_id',
            render: record => (
                <Space size="middle">
                    <Button type="primary">
                        <a
                            className="detail-link"
                            href={
                                record.postTitle
                                    ? `${blogUrl}/post?title=${record.postTitle}`
                                    : `${blogUrl}/msg`
                            }
                            target="_blank"
                            rel="noreferrer"
                        >
                            查看
                        </a>
                    </Button>

                    <Popconfirm
                        placement="topRight"
                        title="确定要删除该评论吗？"
                        onConfirm={() => deleteMsg(record._id)}
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
    return (
        <div className="MsgBox">
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
                dataSource={props.msgs}
                rowKey={columns => columns._id}
                showSorterTooltip={false}
            />
        </div>
    );
};

export default connect(
    state => ({
        msgs: state.msgs,
    }),
    { getMsgs }
)(Msg);
