import { useState, useEffect, useRef } from 'react';
import { Select, Popconfirm, notification } from 'antd';
import { CarryOutOutlined, FileDoneOutlined } from '@ant-design/icons';
import marked from 'marked';
import { db } from '../../../utils/cloudBase';
import hljs from 'highlight.js';
// 代码高亮的主题
import './github-dark.css';
import './index.css';

const { Option } = Select;

const AddArticle = () => {
    // —————————————————————————标题相关————————————————————————————
    const inputTitle = useRef();
    const inputEng = useRef();

    // —————————————————————————标签相关————————————————————————————
    // 所有标签
    const [allTags, setAllTags] = useState([]);
    // 已选的标签
    const [selectTags, setSelectTags] = useState([]);
    useEffect(() => {
        // 从数据库获取所有标签，存入state
        db.collection('tags')
            .get()
            .then(res => {
                // 处理返回的数据为相应格式，并放入state
                const Tags = res.data.map(item => (
                    <Option key={item.content}>{item.content}</Option>
                ));
                setAllTags(Tags);
            });
    }, []);
    // 标签内容改变时触发的函数
    const tagsChange = value => {
        setSelectTags(value);
    };

    // —————————————————————————分类相关————————————————————————————
    // 所有分类
    const [allClasses, setAllClasses] = useState([]);
    // 已选的分类
    const [selectClasses, setSelectClasses] = useState('');
    useEffect(() => {
        // 从数据库获取所有分类，存入state
        db.collection('classes')
            .get()
            .then(res => {
                // 处理返回的数据为相应格式，并放入state
                const classes = res.data.map(item => (
                    <Option key={item.content}>{item.content}</Option>
                ));
                setAllClasses(classes);
            });
    }, []);
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

    // 存为草稿
    const turnDraft = () => {
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
                notification.open({
                    message: '草稿保存成功！',
                    placement: 'bottomLeft',
                    icon: <FileDoneOutlined style={{ color: 'blue' }} />,
                    duration: 3,
                });
            });
    };
    // 发布文章
    const pubArticle = () => {
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
                notification.open({
                    message: '文章发布成功！',
                    placement: 'bottomLeft',
                    icon: <CarryOutOutlined style={{ color: 'blue' }} />,
                    duration: 3,
                });
            });
    };
    return (
        <>
            {/* 标题输入区 */}
            <div className="titleBox">
                <input className="inputTitle" ref={inputTitle} placeholder="请输入文章标题..." />
                <input className="inputEng" ref={inputEng} placeholder="请输入英文标题..." />
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
                    title="确定发布文章吗？"
                    onConfirm={pubArticle}
                    okText="Yes"
                    cancelText="No"
                >
                    发布文章
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
                        onChange={classChange}
                    >
                        {allClasses}
                    </Select>
                </div>
                {/* 标签 */}
                <div className="tagBox">
                    文章标签：
                    <Select
                        mode="multiple"
                        showSearch
                        showArrow
                        style={{ width: '500px' }}
                        placeholder="请选择文章标签"
                        onChange={tagsChange}
                    >
                        {allTags}
                    </Select>
                </div>
            </div>
            {/* 内容编辑区 */}
            <div className="editBox">
                <div
                    className="inputRegion"
                    onInput={textChange}
                    contentEditable="plaintext-only"
                ></div>
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

export default AddArticle;
