import { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Popconfirm, notification, Input } from 'antd';
import { DeleteOutlined, AudioOutlined } from '@ant-design/icons';
import moment from 'moment';
import { db } from '../../../utils/cloudBase';
import './index.css';

const Article = props => {
    // ——————————————————————搜索框——————————————————————
    const { Search } = Input;
    const onPressEnter = () => {
        console.log(111111111);
    };

    // 标识组件是否挂载的state
    const [isMounted, setIsMounted] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        isMounted && getNewArticles();
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
            title: '发布日期',
            dataIndex: 'date',
            key: 'id',
            sorter: (a, b) => a.date - b.date,
            render: text => <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>,
            sortDirections: ['descend'],
            defaultSortOrder: ['ascend'],
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
                    <Button type="primary" onClick={() => editArticle(record.id)}>
                        修改
                    </Button>

                    <Popconfirm
                        placement="topRight"
                        title="确定要删除该文章吗？"
                        onConfirm={() => deleteArticle(record.id)}
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
    // 获取最新所有文章，并放入state
    const getNewArticles = () => {
        setIsLoading(true);
        db.collection('articles')
            .get()
            .then(res => {
                const newArticles = res.data.map(item => {
                    return {
                        id: item._id,
                        class: item.classes,
                        // date: moment(item.date).format('YYYY-MM-DD HH:mm:ss'),
                        date: item.date,
                        tags: item.tags,
                        title: item.title,
                        url: item.url,
                    };
                });
                setArticles(newArticles);
                setIsLoading(false);
            });
    };
    // 删除文章
    const deleteArticle = id => {
        db.collection('articles')
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
                // 获取最新文章数据
                getNewArticles();
            });
    };
    // 修改文章
    const editArticle = id => {
        // 跳转到添加文章页面，并传入该文章id
        props.history.replace(`/admin/addArticle/?id=${id}&isDraft=`);
    };
    return (
        <>
            <div className="searchBox">
                <Search
                    className="Search"
                    placeholder="输入文章标题..."
                    size="large"
                    enterButton
                    onPressEnter={onPressEnter}
                    onSearch={onPressEnter}
                    style={{ width: 500 }}
                />
            </div>
            <Table
                size="middle"
                className="Table"
                bordered
                loading={isLoading}
                pagination={{
                    position: ['bottomCenter'],
                    defaultPageSize: 11,
                    hideOnSinglePage: true,
                    showTitle: false,
                    size: ['small'],
                }}
                onHeaderCell={() => ({ style: { textAlign: 'center', fontWeoght: '700' } })}
                columns={columns}
                dataSource={articles}
                rowKey={columns => columns.id}
                showSorterTooltip={false}
            />
        </>
    );
};

export default Article;
