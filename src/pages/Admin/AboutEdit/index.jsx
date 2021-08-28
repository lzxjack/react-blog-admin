import { useState, useEffect } from 'react';
import { db, auth } from '../../../utils/cloudBase';
import { notification, message } from 'antd';
import { SkinOutlined, HomeOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { getAbout } from '../../../redux/actions';
import { visitorText, adminUid } from '../../../utils/constant';
import qs from 'qs';
import marked from 'marked';
import hljs from 'highlight.js';
import './index.css';

const AboutEdit = props => {
    const [content, setContent] = useState('');
    const [id, setId] = useState('');
    const [isMe, setIsMe] = useState(true);
    const [isJudged, setIsJudged] = useState(false);

    // 判断编辑哪个页面，并设置判断终止标志状态
    useEffect(() => {
        const params = qs.parse(props.location.search.slice(1));
        const isMe = params.isMe ? true : false;
        setIsMe(isMe);
        setIsJudged(true);
    }, [props]);
    // 判断完毕后，从数据库获取相应页面详情
    useEffect(() => {
        if (!isJudged) return;
        const aboutObj = props.about.filter(item => item.isMe === isMe)[0];
        const { content, _id: ID } = aboutObj;
        setId(ID);
        setContent(content);
    }, [isJudged, isMe, props.about]);
    // 配制marked和highlight
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

    // 获取关于详情
    const getAboutData = () => {
        db.collection('about')
            .get()
            .then(res => {
                props.getAbout(res.data);
            });
    };
    // 返回到"关于"页面
    const turnToAbout = () => {
        props.history.push('/admin/about');
    };
    // 更新
    const upDateAbout = () => {
        if (!content) {
            message.info('请写点什么再更新！');
            return;
        }
        if (auth.currentUser.uid !== adminUid) {
            message.warning(visitorText);
            return;
        }
        const messageText = isMe ? '"关于我"更新成功！' : '"关于本站"更新成功！';
        const icon = isMe ? (
            <SkinOutlined style={{ color: 'blue' }} />
        ) : (
            <HomeOutlined style={{ color: 'blue' }} />
        );
        db.collection('about')
            .doc(id)
            .update({
                content,
            })
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                    message.warning(visitorText);
                    return;
                }
                // console.log(res);
                getAboutData();
                turnToAbout();
                notification.open({
                    message: messageText,
                    icon,
                    placement: 'bottomLeft',
                    duration: 1.5,
                });
            });
    };
    return (
        <>
            <div className="aboutEditHeader">
                <div className="aboutReturnBtn" onClick={turnToAbout}>
                    返回
                </div>
                <span className="aboutTitle">关于{isMe ? '我' : '本站'}</span>
                <div className="aboutUpdateBtn" onClick={upDateAbout}>
                    更新
                </div>
            </div>
            <div className="editBox">
                <div
                    className="inputRegion aboutInput"
                    contentEditable="plaintext-only"
                    suppressContentEditableWarning
                    onInput={e => {
                        setContent(e.target.innerText);
                    }}
                >
                    {props.about.filter(item => item.isMe === isMe)[0].content}
                </div>

                <div
                    className="showRegion aboutShow markdownStyle"
                    dangerouslySetInnerHTML={{
                        __html: marked(content).replace(/<pre>/g, "<pre id='hljs'>"),
                    }}
                ></div>
            </div>
        </>
    );
};

export default connect(state => ({ about: state.about }), { getAbout })(AboutEdit);
