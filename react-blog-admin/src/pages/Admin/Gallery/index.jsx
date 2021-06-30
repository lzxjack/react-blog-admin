import { useState, useEffect } from 'react';
import { Modal, message, notification } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import { db } from '../../../utils/cloudBase';
import './index.css';

const Gallery = () => {
    const [galleries, setGalleries] = useState([]);
    const [isMounted, setIsMounted] = useState(true);
    const getAllGalleries = () => {
        db.collection('galleries')
            .get()
            .then(res => {
                setGalleries(res.data);
            });
    };
    useEffect(() => {
        isMounted && getAllGalleries();
        return () => {
            setIsMounted(false);
        };
    }, [isMounted]);

    const [galleryVisible, setGalleryVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [title, setTitle] = useState('');
    const [descr, setDescr] = useState('');
    const [cover, setCover] = useState('');
    const [pics, setPics] = useState('');

    const showAddGallery = () => {
        setGalleryVisible(true);
    };
    const galleryOK = () => {
        if (!title || !descr || !cover || !pics) {
            message.info('请输入完整相册信息！');
            return;
        }
        if (isEdit) {
            // 编辑
        } else {
            // 添加
            const picsArr = pics.split(`\n`);
            db.collection('galleries')
                .add({
                    title,
                    descr,
                    cover,
                    picsArr,
                })
                .then(() => {
                    // 获取所有相册
                    // 关闭对话框
                    setGalleryVisible(false);
                    // 清空输入框
                    clearGalleryInput();
                    // 编辑状态false
                    setIsEdit(false);
                    notification.open({
                        message: '添加相册成功',
                        icon: <PictureOutlined style={{ color: 'blue' }} />,
                        placement: 'bottomLeft',
                        duration: 1.5,
                    });
                });
        }
    };
    const galleryCancel = () => {
        clearGalleryInput();
        setGalleryVisible(false);
        setIsEdit(false);
    };
    const clearGalleryInput = () => {
        setTitle('');
        setDescr('');
        setCover('');
        setPics('');
    };
    return (
        <>
            <div className="addGalleryBox">
                <div type="primary" className="addGalleryBtn" onClick={showAddGallery}>
                    添加相册
                </div>
                <Modal
                    title="添加相册"
                    visible={galleryVisible}
                    style={{ top: 40 }}
                    width={1000}
                    onOk={galleryOK}
                    onCancel={galleryCancel}
                >
                    <div className="galleryInputBox">
                        <div className="modalInputBox">
                            <div className="galleryInputKey">标题：</div>
                            <input
                                className="galleryInputValue"
                                type="text"
                                value={title}
                                onChange={e => {
                                    setTitle(e.target.value);
                                }}
                            />
                        </div>
                        <div className="modalInputBox">
                            <div className="galleryInputKey">描述：</div>
                            <input
                                className="galleryInputValue"
                                type="text"
                                value={descr}
                                onChange={e => {
                                    setDescr(e.target.value);
                                }}
                            />
                        </div>
                        <div className="modalInputBox">
                            <div className="galleryInputKey">封面：</div>
                            <input
                                className="galleryInputValue"
                                type="text"
                                value={cover}
                                onChange={e => {
                                    setCover(e.target.value);
                                }}
                            />
                        </div>
                        <div className="modalTextBox">
                            <div className="galleryInputKey">图片：</div>
                            <textarea
                                className="galleryTextValue"
                                value={pics}
                                onChange={e => {
                                    setPics(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </Modal>
            </div>
            <div className="galleryBox">
                <ul className="galleryUl">
                    {galleries.map(item => {
                        return (
                            <li key={item._id} style={{ backgroundImage: `url(${item.cover})` }}>
                                <div className="galleryTitleBox">
                                    <span>{item.title}</span>
                                </div>
                                <div className="galleryDescr">{item.descr}</div>
                                <div className="galleryMask"></div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
};

export default Gallery;
