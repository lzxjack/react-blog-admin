import { connect } from 'react-redux';
import { useState, useEffect } from 'react';
import { message, Select, Popconfirm, notification } from 'antd';
import { CarryOutOutlined, FileDoneOutlined } from '@ant-design/icons';
import qs from 'qs';
import marked from 'marked';
import { db, _, auth } from '../../../utils/cloudBase';
import { visitorText, adminUid } from '../../../utils/constant';
import moment from 'moment';
import { getClasses, getArticles, getDrafts } from '../../../redux/actions';
import hljs from 'highlight.js';
// 代码高亮的主题
import './github-dark.css';
import './index.css';

const { Option } = Select;
const AddArticle = props => {
    // ————————————————————判断是否是编辑模式、是否是草稿————————————————————————————
    const [isEdit, setIsEdit] = useState(false);
    const [isDraft, setIsDraft] = useState(false);
    const [id, setId] = useState('');
    const [isJudged, setIsJudged] = useState(false);
    useEffect(() => {
        const Edit = props.location.search !== '' ? true : false;
        if (Edit) {
            // 如果是编辑模式，获得id，并判断是否是草稿
            const params = qs.parse(props.location.search.slice(1));
            const { id, isDraft } = params;
            const Draft = isDraft ? true : false;
            setId(id);
            setIsDraft(Draft);
        }
        setIsEdit(Edit);
        setIsJudged(true);
    }, [props.location.search]);

    // —————————————————————编辑时，获取文章详情———————————————————————
    // 从redux获取文章/草稿详情，参数：redux属性名称、文章/草稿ID
    const getDetailFromRedux = isArticle => {
        const detailObj = isArticle
            ? props.articles.filter(item => item._id === id)[0]
            : props.drafts.filter(item => item._id === id)[0];
        // 解构赋值
        const { title, titleEng, content, tags, classes, date } = detailObj;
        setTitle(title);
        setTitleEng(titleEng);
        // 已有的标签存储到state
        setSelectTags(tags);
        // setDefaultTags(tags);
        // 已有的分类存储到state
        setSelectClasses(classes);
        setDefaultClasses(classes);
        // 已有的正文存储到state
        setContent(content);
        setDefaultContent(content);
        setDate(moment(date).format('YYYY-MM-DD HH:mm:ss').replace(/ /g, ' '));
    };
    // 编辑时，组件挂载，自动填入文章详情
    useEffect(() => {
        // 还没有判断完成，直接返回
        if (!isJudged) return;
        //若不是编辑页面，填入当前时间后，返回
        if (!isEdit) {
            setDate(moment().format('YYYY-MM-DD HH:mm:ss').replace(/ /g, ' '));
            return;
        }
        if (!isDraft) {
            // 向redux获取文章详情
            getDetailFromRedux(true);
        } else {
            // 向redux获取草稿详情
            getDetailFromRedux(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, isJudged, isDraft]);
    // —————————————————————编辑时，获取文章详情end———————————————————————

    // ———————————标题、时间———————————————
    const [title, setTitle] = useState('');
    const [titleEng, setTitleEng] = useState('');
    const [date, setDate] = useState('');

    // ———————————标题end———————————————

    // ——————————标签————————————
    // 已选的标签
    const [selectTags, setSelectTags] = useState([]);
    // const [defaultTags, setDefaultTags] = useState([]);
    // ——————————标签end————————————

    // ——————————分类————————————
    // 已选的分类
    const [selectClasses, setSelectClasses] = useState('');
    const [defaultClasses, setDefaultClasses] = useState('');
    // ——————————分类end————————————

    // ————————————正文———————————
    // 编辑区文字
    const [defaultContent, setDefaultContent] = useState('');
    const [content, setContent] = useState('');
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
    // ————————————正文end———————————

    // ——————————————————————两个按钮——————————————————————
    // 获取最新所有文章/草稿
    const getArticlesOrDrafts = dbName => {
        db.collection(dbName)
            .limit(1000)
            .get()
            .then(res => {
                if (dbName === 'articles') {
                    props.getArticles(res.data);
                } else {
                    props.getDrafts(res.data);
                }
            });
    };
    // 添加到文章数据库/草稿数据库，参数：数据库名
    const addToDB = dbName => {
        const page = dbName === 'articles' ? '/admin/article' : '/admin/draft';
        const messages = dbName === 'articles' ? '文章发布成功！' : '草稿保存成功！';
        const icon =
            dbName === 'articles' ? (
                <CarryOutOutlined style={{ color: 'blue' }} />
            ) : (
                <FileDoneOutlined style={{ color: 'blue' }} />
            );
        db.collection(dbName)
            .add({
                title,
                titleEng,
                content,
                tags: selectTags,
                classes: selectClasses,
                date: new Date(date).getTime(),
                url: `https://lzxjack.top/post?title=${titleEng}`,
            })
            .then(res => {
                // console.log(res);
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                    message.warning(visitorText);
                    return;
                }
                getArticlesOrDrafts(dbName);
                // 转到草稿页/文章页
                props.history.push(page);
                // 提示消息
                notification.open({
                    message: messages,
                    placement: 'bottomLeft',
                    icon,
                    duration: 1.5,
                });
            });
    };
    // 从文章数据库/草稿数据库删除，参数：数据库名、文章id
    const removeFromDB = dbName => {
        db.collection(dbName)
            .doc(id)
            .remove()
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                    message.warning(visitorText);
                    return;
                }
                getArticlesOrDrafts(dbName);
            });
    };
    // 从文章数据库/草稿数据库更新，参数：数据库名、文章id
    const updateFromDB = dbName => {
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
                title,
                titleEng,
                content,
                tags: selectTags,
                classes: selectClasses,
                date: new Date(date).getTime(),
                url: `https://lzxjack.top/post?title=${titleEng}`,
            })
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                    message.warning(visitorText);
                    return;
                }
                getArticlesOrDrafts(dbName);
                // 回到文章页/草稿页
                props.history.push(page);
                // 提示消息
                notification.open({
                    message,
                    placement: 'bottomLeft',
                    icon,
                    duration: 1.5,
                });
            });
    };
    // 向数据库获取所有分类
    const getAllClasses = () => {
        db.collection('classes')
            .limit(1000)
            .get()
            .then(res => {
                props.getClasses(res.data);
            });
    };
    // 相应分类数目+1
    const classAddOne = newClass => {
        db.collection('classes')
            .where({ class: newClass })
            .update({
                count: _.inc(1),
            })
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') return;
                getAllClasses();
            });
    };
    // 相应分类数目-1
    const classMinOne = oldClass => {
        db.collection('classes')
            .where({ class: oldClass })
            .update({
                count: _.inc(-1),
            })
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                    message.warning(visitorText);
                    return;
                }
                getAllClasses();
            });
    };
    // 存为草稿 按钮1
    const turnDraft = () => {
        if (!title) {
            message.info('请输入文章标题！');
            return;
        }
        if (!titleEng) {
            message.info('请输入英文标题！');
            return;
        }
        // 判断英文标题是否存在
        const sameEngInDrafts = props.drafts
            .filter(item => item.titleEng === titleEng)
            .filter(item => item._id !== id);
        // 如果分类存在，直接返回
        if (sameEngInDrafts.length) {
            message.warning('英文标题已存在！');
            return;
        }
        if (auth.currentUser.uid !== adminUid) {
            message.warning(visitorText);
            return;
        }
        if (!isEdit) {
            // 新建文章按钮进来的
            addToDB('drafts');
        } else {
            // 修改按钮进来的
            if (isDraft) {
                // 草稿页的修改按钮
                updateFromDB('drafts');
            } else {
                // 文章页的修改按钮
                removeFromDB('articles');
                addToDB('drafts');
                // oldCount--
                classMinOne(defaultClasses);
            }
        }
    };
    // 发布文章 按钮2
    const turnArticle = () => {
        if (!title) {
            message.info('请输入文章标题！');
            return;
        }
        if (!titleEng) {
            message.info('请输入英文标题！');
            return;
        }
        // 判断英文标题是否存在
        const sameEngInArticles = props.articles
            .filter(item => item.titleEng === titleEng)
            .filter(item => item._id !== id);
        // 如果分类存在，直接返回
        if (sameEngInArticles.length) {
            message.warning('英文标题已存在！');
            return;
        }
        if (auth.currentUser.uid !== adminUid) {
            message.warning(visitorText);
            return;
        }
        if (!isEdit) {
            // 新建文章按钮进来的
            addToDB('articles');
            // newCount++
            classAddOne(selectClasses);
        } else {
            // 修改按钮进来的
            if (isDraft) {
                // 草稿页的修改按钮
                removeFromDB('drafts');
                addToDB('articles');
                // newCount++
                classAddOne(selectClasses);
            } else {
                // 文章页的修改按钮
                updateFromDB('articles');
                if (selectClasses !== defaultClasses) {
                    // 如果更换了分类
                    // oldCount--
                    classMinOne(defaultClasses);
                    // newCount++
                    classAddOne(selectClasses);
                }
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
                    placeholder="请输入文章标题..."
                    value={title}
                    onChange={e => {
                        setTitle(e.target.value);
                    }}
                />
                <input
                    className="inputEng"
                    placeholder="请输入英文标题..."
                    value={titleEng}
                    onChange={e => {
                        setTitleEng(e.target.value);
                    }}
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
                    title={`确定${isEdit && !isDraft ? '更新' : '发布'}文章吗？`}
                    onConfirm={turnArticle}
                    okText="Yes"
                    cancelText="No"
                >
                    {isEdit && !isDraft ? '更新' : '发布'}
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
                        allowClear
                        style={{ width: '330px' }}
                        value={selectClasses}
                        onChange={value => setSelectClasses(value ? value : '')}
                    >
                        {props.classes.map(item => (
                            <Option key={item.class}>{item.class}</Option>
                        ))}
                    </Select>
                </div>
                {/* 标签 */}
                <div className="tagBox">
                    文章标签：
                    <Select
                        mode="multiple"
                        showSearch
                        showArrow
                        allowClear
                        style={{ width: '740px' }}
                        value={selectTags}
                        onChange={value => setSelectTags(value)}
                    >
                        {props.tags.map(item => (
                            <Option key={item.tag}>{item.tag}</Option>
                        ))}
                    </Select>
                </div>
                {/* 时间 */}
                <div className="timeBox">
                    时间：
                    <input
                        className="timeInput"
                        type="text"
                        value={date}
                        onChange={e => {
                            setDate(e.target.value);
                        }}
                    />
                </div>
            </div>
            {/* 内容编辑区 */}
            <div className="editBox">
                <div
                    className="inputRegion"
                    onInput={e => {
                        setContent(e.target.innerText);
                    }}
                    contentEditable="plaintext-only"
                    suppressContentEditableWarning
                >
                    {defaultContent}
                </div>

                <div
                    className="showRegion markdownStyle"
                    dangerouslySetInnerHTML={{
                        __html: marked(content).replace(/<pre>/g, "<pre id='hljs'>"),
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
        articles: state.articles,
        drafts: state.drafts,
    }),
    { getClasses, getArticles, getDrafts }
)(AddArticle);
