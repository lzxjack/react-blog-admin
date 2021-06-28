import { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Popconfirm, notification } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { db } from '../../../utils/cloudBase';
import './index.css';

const Draft = props => {
    // 标识组件是否挂载的state
    const [isMounted, setIsMounted] = useState(true);
    const [drafts, setDrafts] = useState([]);

    useEffect(() => {
        isMounted && getNewDrafts();
        return () => {
            setIsMounted(false);
        };
    }, [isMounted]);

    // 表头
    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'id',
            render: text => <strong>{text}</strong>,
        },
        {
            title: '保存日期',
            dataIndex: 'date',
            key: 'id',
        },
        {
            title: '分类',
            dataIndex: 'class',
            key: 'id',
            render: text => (
                <>
                    <Tag color="#2db7f5">{text}</Tag>
                </>
            ),
        },
        {
            title: '标签',
            dataIndex: 'tags',
            key: 'id',
            render: tags => (
                <>
                    {tags.map(tag => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        return (
                            <Tag color={color} key={tag}>
                                {tag}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'id',
            render: text => (
                <a href={text} target="_blank" rel="noreferrer">
                    {text}
                </a>
            ),
        },
        {
            title: '操作',
            key: 'id',
            render: record => (
                <Space size="middle">
                    <Button type="primary" onClick={() => editDraft(record.id)}>
                        修改
                    </Button>

                    <Popconfirm
                        placement="topRight"
                        title="确定要删除该文章吗？"
                        onConfirm={() => deleteDraft(record.id)}
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
    // 获取所有最新草稿，并保存到state
    const getNewDrafts = () => {
        db.collection('drafts')
            .get()
            .then(res => {
                const newDrafts = res.data.map(item => {
                    return {
                        id: item._id,
                        class: item.classes,
                        date: moment(item.date).format('YYYY-MM-DD HH:mm:ss'),
                        tags: item.tags,
                        title: item.title,
                        url: item.url,
                    };
                });
                setDrafts(newDrafts);
            });
    };
    // 编辑草稿
    const editDraft = id => {
        // 跳转到添加文章页面，并传入该文章id
        props.history.replace(`/admin/addArticle/?id=${id}&isDraft=1`);
    };
    // 删除草稿
    const deleteDraft = id => {
        db.collection('drafts')
            .doc(id)
            .remove()
            .then(() => {
                // 删除成功，提示消息
                notification.open({
                    message: '删除成功',
                    icon: <DeleteOutlined style={{ color: 'blue' }} />,
                    placement: 'bottomLeft',
                    duration: 2,
                });
                // 获取最新草稿数据
                getNewDrafts();
            });
    };
    return (
        <>
            <Table
                size="middle"
                className="Table"
                bordered
                pagination={{ position: ['bottomCenter'], defaultPageSize: 11 }}
                onHeaderCell={() => ({ style: { textAlign: 'center', fontWeoght: '700' } })}
                columns={columns}
                dataSource={drafts}
                rowKey={columns => columns.id}
            />
        </>
    );
};

export default Draft;
