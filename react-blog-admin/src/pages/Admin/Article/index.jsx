import { Table, Tag, Space } from 'antd';
import './index.css';

const Article = props => {
    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            render: text => <a>{text}</a>,
        },
        {
            title: '发布日期',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '分类',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '标签',
            key: 'tags',
            dataIndex: 'tags',
            render: tags => (
                <>
                    {tags.map(tag => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'URL',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a>查看</a>
                    <a>修改 {record.name}</a>
                    <a>删除</a>
                </Space>
            ),
        },
    ];
    const data = [
        {
            key: '1',
            title: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
        },
        {
            key: '2',
            title: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        },
        {
            key: '3',
            title: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        },
    ];
    const turnAddPage = () => {
        // 转到新建文章页面
        props.history.push('/admin/addArticle');
    };
    return (
        <>
            <div className="searchBox">
                <div className="addArticleBtn" onClick={turnAddPage}>
                    写文章
                </div>
            </div>
            <div className="articlesBox">
                <Table columns={columns} dataSource={data} />
            </div>
        </>
    );
};

export default Article;
