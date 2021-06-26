import { useState, useEffect } from 'react';
import marked from 'marked';
import hljs from 'highlight.js';
// 代码高亮的主题
import 'highlight.js/styles/github-dark.css';
import './index.css';

const AddArticle = () => {
    const [text, setText] = useState('');

    // 文本改变，更新状态，预览区更新
    const textChange = e => {
        setText(marked(e.target.innerText).replace(/<pre>/g, "<pre class='hljs'>"));
    };

    useEffect(() => {
        // 配置marked
        marked.setOptions({
            renderer: new marked.Renderer(),
            highlight: code => hljs.highlightAuto(code).value,
            gfm: true, //默认为true。 允许 Git Hub标准的markdown.
            tables: true, //默认为true。 允许支持表格语法。该选项要求 gfm 为true。
            breaks: true, //默认为false。 允许回车换行。该选项要求 gfm 为true。
        });
    }, []);

    return (
        <>
            <div className="titleBox">
                <input className="inputTitle" placeholder="请输入文章标题..." />
                <div className="draftBtn">存为草稿</div>
                <div className="pubBtn">发布文章</div>
            </div>
            <div className="contentBox">
                <div
                    className="inputRegion"
                    onInput={textChange}
                    contentEditable="plaintext-only"
                ></div>
                <div className="showRegion" dangerouslySetInnerHTML={{ __html: text }}></div>
            </div>
        </>
    );
};

export default AddArticle;
