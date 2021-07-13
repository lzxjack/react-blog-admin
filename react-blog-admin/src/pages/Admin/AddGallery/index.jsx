import { useState, useEffect } from 'react';
import { notification, Popconfirm } from 'antd';
import { CameraOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { getGalleries } from '../../../redux/actions';
import { nanoid } from 'nanoid';
import { db } from '../../../utils/cloudBase';
import './index.css';

const AddGallery = props => {
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [descr, setDescr] = useState('');
    const [cover, setCover] = useState('');
    const [pics, setPics] = useState([]);

    // 编辑状态，获取当前相册详情
    useEffect(() => {
        if (props.location.search !== '') {
            const ID = props.location.search.split('?id=')[1];
            setId(ID);
            const galleryObj = props.galleries.filter(item => item._id === ID)[0];
            const { title, descr, cover, pics } = galleryObj;
            setTitle(title);
            setDescr(descr);
            setCover(cover);
            setPics(pics);
        }
    }, [props]);

    // 向数据库获取最新相册信息
    const getNewGalleries = () => {
        db.collection('galleries')
            .get()
            .then(res => {
                props.getGalleries(res.data);
            });
    };

    // 更新/添加相册之后的操作
    const afterGalleryChange = isEdit => {
        const message = isEdit ? '更新相册成功' : '添加相册成功';
        const icon = isEdit ? (
            <CopyOutlined style={{ color: 'blue' }} />
        ) : (
            <CameraOutlined style={{ color: 'blue' }} />
        );
        props.history.replace('/admin/gallery');
        notification.open({
            message,
            icon,
            placement: 'bottomLeft',
            duration: 1.5,
        });
    };

    // 添加相册
    const addGallery = () => {
        db.collection('galleries')
            .add({
                title,
                descr,
                cover,
                pics,
            })
            .then(() => {
                getNewGalleries();
                afterGalleryChange(0);
            });
    };
    // 更新相册
    const updateGallery = () => {
        if (props.location.search === '') return;
        db.collection('galleries')
            .doc(id)
            .update({
                title,
                descr,
                cover,
                pics,
            })
            .then(() => {
                getNewGalleries();
                afterGalleryChange(1);
            });
    };
    // 删除相册
    const deleteGallery = () => {
        if (props.location.search === '') return;
        db.collection('galleries')
            .doc(id)
            .remove()
            .then(() => {
                getNewGalleries();
                props.history.replace('/admin/gallery');
                notification.open({
                    message: '删除相册成功',
                    icon: <DeleteOutlined style={{ color: 'blue' }} />,
                    placement: 'bottomLeft',
                    duration: 1.5,
                });
            });
    };
    return (
        <>
            <div className="addGalleryBox">
                <div
                    className="addGalleryBtn"
                    onClick={() => {
                        props.history.replace('/admin/gallery');
                    }}
                >
                    返回
                </div>
                <div
                    className="addGallery"
                    onClick={props.location.search !== '' ? updateGallery : addGallery}
                >
                    {props.location.search !== '' ? '更新' : '添加'}
                </div>
                <Popconfirm
                    placement="bottomRight"
                    title="确定要删除该相册吗？"
                    onConfirm={deleteGallery}
                    okText="Yes"
                    cancelText="No"
                >
                    <div
                        className="deleteGallery"
                        style={{ right: props.location.search !== '' ? '5px' : '-200px' }}
                    >
                        删除
                    </div>
                </Popconfirm>
            </div>
            <div className="editBox">
                <div className="inputRegion inputPic">
                    {/* {props.location.search !== '' ? articleDetail.mainContent : ''} */}
                    <div className="modalInputBox galleryInputBox">
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
                    <div className="modalInputBox galleryInputBox">
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
                    <div className="modalInputBox galleryInputBox">
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
                    <div className="addGalleryTextBox">
                        <div className="galleryInputKey">图片：</div>
                        <textarea
                            className="galleryTextValue"
                            value={pics.join(`\n`)}
                            onChange={e => {
                                setPics(e.target.value.split(`\n`));
                            }}
                        />
                    </div>
                </div>
                <div className="showRegion showPic">
                    <ul>
                        {pics.map(item => (
                            <li
                                key={nanoid()}
                                style={{
                                    backgroundImage: `url(${item})`,
                                }}
                            ></li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default connect(state => ({ galleries: state.galleries }), { getGalleries })(AddGallery);
