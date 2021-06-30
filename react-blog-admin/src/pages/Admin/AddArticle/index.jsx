import { connect } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { Select, Popconfirm, notification } from 'antd';
import { CarryOutOutlined, FileDoneOutlined } from '@ant-design/icons';
import qs from 'qs';
import marked from 'marked';
import { db } from '../../../utils/cloudBase';
import hljs from 'highlight.js';
// 代码高亮的主题
import './github-dark.css';
import './index.css';

const AddArticle = props => {
    // —————————————————————编辑时，获取文章详情———————————————————————
    const [articleDetail, setArticleDetail] = useState({});
    // 从数据库获取文章/草稿详情，参数：数据库名称、文章/草稿ID
    const getDetailFromDB = (dbName, id) => {
        db.collection(dbName)
            .doc(id)
            .get()
            .then(res => {
                // 从res.data中解构赋值
                const { title, titleEng, mainContent, tags, classes } = res.data[0];
                const articleInfo = {
                    title,
                    titleEng,
                    mainContent,
                    tags,
                    classes,
                };
                // 文章详情存储到state中
                setArticleDetail(articleInfo);
                // 已有的标签存储到state
                setSelectTags(tags);
                // 已有的分类存储到state
                setSelectClasses(classes);
                // 已有的正文存储到state
                setText(mainContent);
            });
    };
    // 编辑时，组件挂载，自动填入文章详情
    useEffect(() => {
        // 判断是编辑页面再继续操作
        if (props.location.search !== '') {
            const params = qs.parse(props.location.search.slice(1));
            const { id, isDraft } = params;
            if (!isDraft) {
                // 向数据库获取文章详情
                getDetailFromDB('articles', id);
            } else {
                // 向数据库获取草稿详情
                getDetailFromDB('drafts', id);
            }
        }
    }, [props.location.search]);
    // —————————————————————编辑时，获取文章详情end———————————————————————

    // ———————————标题———————————————
    const inputTitle = useRef();
    const inputEng = useRef();
    // ———————————标题end———————————————

    // ——————————标签end————————————
    // 已选的标签
    const [selectTags, setSelectTags] = useState([]);
    // 标签内容改变时触发的函数
    const tagsChange = value => {
        setSelectTags(value);
    };
    // ——————————标签end————————————

    // ——————————分类————————————
    // 已选的分类
    const [selectClasses, setSelectClasses] = useState('');
    const classChange = value => {
        setSelectClasses(value);
    };
    // ——————————分类end————————————

    // ————————————正文———————————
    // 编辑区文字
    const [text, setText] = useState('');
    useEffect(() => {
        // 配置highlight
        hljs.configure({
            tabReplace: '',
            classPrefix: 'hljs-',
            languages: ['CSS', 'HTML', 'JavaScript', 'Python', 'TypeScript', 'Markdown'],
        });
        // 配置marked
        marked.setOptions({
            renderer: new marked.Renderer(),
            highlight: code => hljs.highlightAuto(code).value,
            gfm: true, //默认为true。 允许 Git Hub标准的markdown.
            tables: true, //默认为true。 允许支持表格语法。该选项要求 gfm 为true。
            breaks: true, //默认为false。 允许回车换行。该选项要求 gfm 为true。
        });
    }, []);
    // 文本改变，更新状态，预览区更新
    const textChange = e => {
        setText(e.target.innerText);
    };
    // ————————————正文end———————————

    // ——————————————————————两个按钮——————————————————————
    // 添加到文章数据库/草稿数据库，参数：数据库名
    const addToDB = dbName => {
        const page = dbName === 'articles' ? '/admin/article' : '/admin/draft';
        const message = dbName === 'articles' ? '文章发布成功！' : '草稿保存成功！';
        const icon =
            dbName === 'articles' ? (
                <CarryOutOutlined style={{ color: 'blue' }} />
            ) : (
                <FileDoneOutlined style={{ color: 'blue' }} />
            );
        db.collection(dbName)
            .add({
                title: inputTitle.current.value,
                titleEng: inputEng.current.value,
                mainContent: text,
                tags: selectTags,
                classes: selectClasses,
                date: new Date().getTime(),
                url: `https://lzxjack.top/${inputEng.current.value}`,
            })
            .then(() => {
                // 转到草稿页/文章页
                props.history.replace(page);
                // 提示消息
                notification.open({
                    message,
                    placement: 'bottomLeft',
                    icon,
                    duration: 3,
                });
            });
    };
    // 从文章数据库/草稿数据库删除，参数：数据库名、文章id
    const removeFromDB = (dbName, id) => {
        db.collection(dbName).doc(id).remove();
    };
    // 从文章数据库/草稿数据库更新，参数：数据库名、文章id
    const updateFromDB = (dbName, id) => {
        const page = dbName === 'articles' ? '/admin/article' : '/admin/draft';
        const message = dbName === 'articles' ? '文章更新成功！' : '草稿保存成功！';
        const icon =
            dbName === 'articles' ? (
                <CarryOutOutlined style={{ color: 'blue' }} />
            ) : (
                <FileDoneOutlined style={{ color: 'blue' }} />
            );
        db.collection(dbName)
            .doc(id)
            .update({
                title: inputTitle.current.value,
                titleEng: inputEng.current.value,
                mainContent: text,
                tags: selectTags,
                classes: selectClasses,
                date: new Date().getTime(),
                url: `https://lzxjack.top/${inputEng.current.value}`,
            })
            .then(() => {
                // 回到文章页
                props.history.replace(page);
                // 提示消息
                notification.open({
                    message,
                    placement: 'bottomLeft',
                    icon,
                    duration: 3,
                });
            });
    };
    // 存为草稿 按钮1
    const turnDraft = () => {
        if (props.location.search === '') {
            // 新建文章按钮进来的
            addToDB('drafts');
        } else {
            // 修改按钮进来的
            const params = qs.parse(props.location.search.slice(1));
            const { id, isDraft } = params;
            if (isDraft) {
                // 草稿页的修改按钮
                updateFromDB('drafts', id);
            } else {
                // 文章页的修改按钮
                removeFromDB('articles', id);
                addToDB('drafts');
            }
        }
    };
    // 发布文章 按钮2
    const turnArticle = () => {
        if (props.location.search === '') {
            // 新建文章按钮进来的
            addToDB('articles');
        } else {
            // 修改按钮进来的
            const params = qs.parse(props.location.search.slice(1));
            const { id, isDraft } = params;
            if (isDraft) {
                // 草稿页的修改按钮
                removeFromDB('drafts', id);
                addToDB('articles');
            } else {
                // 文章页的修改按钮
                updateFromDB('articles', id);
            }
        }
    };
    // ——————————————————————两个按钮end——————————————————————

    return (
        <>
            {/* 标题输入区 */}
            <div className="titleBox">
                <input
                    className="inputTitle"
                    ref={inputTitle}
                    placeholder="请输入文章标题..."
                    defaultValue={props.location.search !== '' ? articleDetail.title : ''}
                />
                <input
                    className="inputEng"
                    ref={inputEng}
                    placeholder="请输入英文标题..."
                    defaultValue={props.location.search !== '' ? articleDetail.titleEng : ''}
                />
                <Popconfirm
                    className="draftBtn"
                    placement="bottomRight"
                    title="确定保存为草稿吗？"
                    onConfirm={turnDraft}
                    okText="Yes"
                    cancelText="No"
                >
                    存为草稿
                </Popconfirm>
                <Popconfirm
                    className="pubBtn"
                    placement="bottomRight"
                    title={`确定${
                        props.location.search !== '' &&
                        !qs.parse(props.location.search.slice(1)).isDraft
                            ? '更新'
                            : '发布'
                    }文章吗？`}
                    onConfirm={turnArticle}
                    okText="Yes"
                    cancelText="No"
                >
                    {props.location.search !== '' &&
                    !qs.parse(props.location.search.slice(1)).isDraft
                        ? '更新'
                        : '发布'}
                    文章
                </Popconfirm>
            </div>

            {/* 标签、分类区 */}
            <div className="tagClassBox">
                {/* 分类 */}
                <div className="classBox">
                    文章分类：
                    <Select
                        showSearch
                        style={{ width: '300px' }}
                        placeholder="请选择文章分类"
                        key={props.location.search !== '' ? articleDetail.classes : ''}
                        defaultValue={props.location.search !== '' ? articleDetail.classes : ''}
                        onChange={classChange}
                    >
                        {props.classes}
                    </Select>
                </div>
                {/* 标签 */}
                <div className="tagBox">
                    文章标签：
                    <Select
                        mode="multiple"
                        showSearch
                        showArrow
                        style={{ width: '600px' }}
                        placeholder="请选择文章标签"
                        key={props.location.search !== '' ? articleDetail.tags : []}
                        defaultValue={props.location.search !== '' ? articleDetail.tags : []}
                        onChange={tagsChange}
                    >
                        {props.tags}
                    </Select>
                </div>
            </div>
            {/* 内容编辑区 */}
            <div className="editBox">
                <div
                    className="inputRegion"
                    onInput={textChange}
                    contentEditable="plaintext-only"
                    suppressContentEditableWarning
                >
                    {props.location.search !== '' ? articleDetail.mainContent : ''}
                </div>
                <div
                    className="showRegion"
                    dangerouslySetInnerHTML={{
                        __html: marked(text).replace(/<pre>/g, "<pre id='hljs'>"),
                    }}
                ></div>
            </div>
        </>
    );
};

export default connect(
    state => ({
        tags: state.tags,
        classes: state.classes,
    }),
    {}
)(AddArticle);
