import { connect } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { Select, Popconfirm, notification } from 'antd';
import { CarryOutOutlined, FileDoneOutlined } from '@ant-design/icons';
import marked from 'marked';
import { db } from '../../../utils/cloudBase';
import hljs from 'highlight.js';
// 代码高亮的主题
import './github-dark.css';
import './index.css';

const AddArticle = props => {
    // ——————————————————是否是编辑状态的flag————————————————————
    // const [isEdit, setIsEdit] = useState(false);
    // useEffect(() => {
    //     setIsEdit(props.location.search ? true : false);
    // }, [props.location.search]);

    // ——————————————————编辑时，根据文章ID获取文章详情————————————————————
    const [articleDetail, setArticleDetail] = useState({});
    useEffect(() => {
        // 判断是编辑页面再继续操作
        if (props.location.search !== '') {
            // console.log(props);
            // console.log('编辑状态');
            // 获取文章ID
            const id = props.location.search.split('?id=')[1];
            // 向数据库获取文章详情
            db.collection('articles')
                .doc(id)
                .get()
                .then(res => {
                    // 从res.data中解构赋值
                    const { title, titleEng, mainContent, tags, classes } = res.data[0];
                    // console.log(tags);
                    const articleInfo = {
                        id,
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
        }
    }, [props.location.search]);

    // —————————————————————————标题相关————————————————————————————
    const inputTitle = useRef();
    const inputEng = useRef();

    // —————————————————————————标签相关————————————————————————————
    // 已选的标签
    const [selectTags, setSelectTags] = useState([]);
    // 标签内容改变时触发的函数
    const tagsChange = value => {
        setSelectTags(value);
    };

    // —————————————————————————分类相关————————————————————————————
    // 已选的分类
    const [selectClasses, setSelectClasses] = useState('');
    const classChange = value => {
        setSelectClasses(value);
    };

    // —————————————————————————内容相关————————————————————————————
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

    // 发布新草稿的函数
    const pubToDraft = () => {
        db.collection('drafts')
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
                // 转到草稿页
                props.history.replace('/admin/draft');
                // 提示消息
                notification.open({
                    message: '草稿保存成功！',
                    placement: 'bottomLeft',
                    icon: <FileDoneOutlined style={{ color: 'blue' }} />,
                    duration: 3,
                });
            });
    };
    // 存为草稿
    const turnDraft = () => {
        if (props.location.search !== '') {
            // 已发布的文章转为草稿
            // 1. 将文章从已发布的数据库中删除
            const id = props.location.search.split('?id=')[1];
            db.collection('articles').doc(id).remove();
        }
        // 发布新草稿
        pubToDraft();
    };
    // 发布文章
    const pubArticle = () => {
        if (props.location.search !== '') {
            // 更新旧文章
            const id = props.location.search.split('?id=')[1];
            db.collection('articles')
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
                    props.history.replace('/admin/article');
                    // 提示消息
                    notification.open({
                        message: '文章更新成功！',
                        placement: 'bottomLeft',
                        icon: <CarryOutOutlined style={{ color: 'blue' }} />,
                        duration: 3,
                    });
                });
        } else {
            // 发布新文章
            db.collection('articles')
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
                    // 回到文章页
                    props.history.replace('/admin/article');
                    // 提示消息
                    notification.open({
                        message: '文章发布成功！',
                        placement: 'bottomLeft',
                        icon: <CarryOutOutlined style={{ color: 'blue' }} />,
                        duration: 3,
                    });
                });
        }
    };
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
                    title={`确定${props.location.search !== '' ? '更新' : '发布'}文章吗？`}
                    onConfirm={pubArticle}
                    okText="Yes"
                    cancelText="No"
                >
                    {props.location.search !== '' ? '更新' : '发布'}文章
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
