import { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Table, Tag, Space, Button, Popconfirm, notification, Select } from 'antd';
import { DeleteOutlined, RedoOutlined } from '@ant-design/icons';
import moment from 'moment';
import { db, _ } from '../../../utils/cloudBase';
import { isContained } from '../../../functions';
import { getClasses } from '../../../redux/actions/classes';
import './index.css';

const { Option } = Select;
const Article = props => {
    // ——————————————————————搜索框——————————————————————
    const searchWords = useRef();
    const [searchClass, setSearchClass] = useState(null);
    const [searchTag, setSearchTag] = useState([]);
    // 通过输入文字搜索
    const searchByWords = () => {
        setSearchClass(null);
        setSearchTag([]);
        const keyWords = searchWords.current.value;
        // 如果输入框内容为空，则展示所有文章
        if (!keyWords) {
            setArticlesShow(articles);
            return;
        }
        // 过滤出搜索到的文章
        const newArticlesShow = articles.filter(item => item.title.indexOf(keyWords) !== -1);
        // 将搜索到的文章，放入要显示的state
        setArticlesShow(newArticlesShow);
    };
    // 通过选择分类搜索
    const searchByClass = classesName => {
        searchWords.current.value = '';
        setSearchTag([]);
        if (!classesName) {
            setArticlesShow(articles);
            return;
        }
        const newArticlesShow = articles.filter(item => item.classes === classesName);
        setArticlesShow(newArticlesShow);
    };
    // 通过选择标签搜索
    const searchByTag = tagsArr => {
        searchWords.current.value = '';
        setSearchClass(null);
        if (tagsArr.length === 0) {
            setArticlesShow(articles);
            return;
        }
        const articlesLen = articles.length;
        const articlesByTag = [];
        for (let i = 0; i < articlesLen; i++) {
            // console.log(isContained(articles[i].tags, tagsArr));
            if (isContained(articles[i].tags, tagsArr)) {
                articlesByTag.push(articles[i]);
            }
        }
        setArticlesShow(articlesByTag);
    };
    // 清空搜索内容
    const resetSearch = () => {
        searchWords.current.value = '';
        setSearchClass(null);
        setSearchTag([]);
        setArticlesShow(articles);
    };
    // ————————————————————搜索框end————————————————————————

    // ——————————————————————渲染文章表格——————————————————————
    // 标识组件是否挂载的state
    const [isMounted, setIsMounted] = useState(true);
    // 是否正在加载的state
    const [isLoading, setIsLoading] = useState(false);
    // 需要展示文章的state
    const [articlesShow, setArticlesShow] = useState([]);
    // 存放所有文章的state
    const [articles, setArticles] = useState([]);
    // 表头
    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: '_id',
            render: text => <strong>{text}</strong>,
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
            title: '分类',
            dataIndex: 'classes',
            key: '_id',
            render: text => (
                <>
                    <Tag color="#2db7f5">{text}</Tag>
                </>
            ),
        },
        {
            title: '标签',
            dataIndex: 'tags',
            key: '_id',
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
            key: '_id',
            render: text => (
                <a href={text} target="_blank" rel="noreferrer">
                    {text}
                </a>
            ),
        },
        {
            title: '操作',
            key: '_id',
            render: record => (
                <Space size="middle">
                    <Button type="primary" onClick={() => editArticle(record._id)}>
                        修改
                    </Button>

                    <Popconfirm
                        placement="topRight"
                        title="确定要删除该文章吗？"
                        onConfirm={() => {
                            deleteArticle(record._id);
                            classMinOne(record.classes);
                        }}
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
                // 用作展示的state
                setArticlesShow(res.data);
                // 存放所有文章的state
                setArticles(res.data);
                setIsLoading(false);
            });
    };
    // 组件挂载完毕，获得所有文章
    useEffect(() => {
        isMounted && getNewArticles();
        return () => {
            setIsMounted(false);
        };
    }, [isMounted]);
    // ————————————————————渲染文章表格end——————————————————————————

    // ——————————————————————对文章的操作——————————————————————
    // 删除文章
    const deleteArticle = id => {
        db.collection('articles')
            .doc(id)
            .remove()
            .then(() => {
                // 获取最新文章数据
                getNewArticles();
                // 删除成功，提示消息
                notification.open({
                    message: '删除成功',
                    icon: <DeleteOutlined style={{ color: 'blue' }} />,
                    placement: 'bottomLeft',
                    duration: 1.5,
                });
            });
    };
    // 向数据库获取所有分类
    const getAllClasses = () => {
        db.collection('classes')
            .get()
            .then(res => {
                props.getClasses(res.data);
            });
    };
    // 相应分类数目-1
    const classMinOne = oldClass => {
        console.log(oldClass);
        db.collection('classes')
            .where({ class: oldClass })
            .update({
                count: _.inc(-1),
            })
            .then(() => {
                getAllClasses();
            });
    };
    // 修改文章
    const editArticle = id => {
        // 跳转到添加文章页面，并传入该文章id
        props.history.replace(`/admin/addArticle?id=${id}&isDraft=`);
    };
    // 添加文章：转到新建文章页面
    const turnAddPage = () => {
        props.history.push('/admin/addArticle');
    };
    // ———————————————————————对文章的操作end—————————————————————————

    return (
        <>
            <div className="searchBox">
                <div className="addArticleBtn" onClick={turnAddPage}>
                    写文章
                </div>
                <input
                    type="text"
                    ref={searchWords}
                    className="Search"
                    placeholder="输入文章标题..."
                    onChange={searchByWords}
                />
                <div className="resetBtn" onClick={resetSearch}>
                    <RedoOutlined />
                </div>
                <Select
                    showSearch
                    size="large"
                    allowClear
                    style={{ width: '360px' }}
                    placeholder="请选择文章分类"
                    className="searchClass"
                    value={searchClass}
                    onChange={value => {
                        searchByClass(value);
                        setSearchClass(value);
                    }}
                >
                    {props.classes.map(item => (
                        <Option key={item.class}>{item.class}</Option>
                    ))}
                </Select>
                <Select
                    mode="multiple"
                    showSearch
                    showArrow
                    size="large"
                    allowClear
                    style={{ width: '500px' }}
                    placeholder="请选择文章标签"
                    className="searchTag"
                    value={searchTag}
                    onChange={value => {
                        searchByTag(value);
                        setSearchTag(value);
                    }}
                >
                    {props.tags.map(item => (
                        <Option key={item.tag}>{item.tag}</Option>
                    ))}
                </Select>
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
                columns={columns}
                dataSource={articlesShow}
                rowKey={columns => columns._id}
                showSorterTooltip={false}
            />
        </>
    );
};

export default connect(
    state => ({
        tags: state.tags,
        classes: state.classes,
    }),
    { getClasses }
)(Article);
