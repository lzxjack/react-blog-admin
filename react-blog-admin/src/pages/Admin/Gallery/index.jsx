import { useState, useEffect } from 'react';
// import { message, notification } from 'antd';
// import { PictureOutlined } from '@ant-design/icons';
import { db } from '../../../utils/cloudBase';
import './index.css';

const Gallery = props => {
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

    const editGallery = id => {
        props.history.push(`/admin/addGallery/?id=${id}`);
    };
    return (
        <>
            <div className="addGalleryBox">
                <div
                    className="addGalleryBtn"
                    onClick={() => {
                        // setGalleryVisible(true);
                        props.history.push('/admin/addGallery');
                    }}
                >
                    添加相册
                </div>
            </div>
            <div className="galleryBox">
                <ul className="galleryUl">
                    {galleries.map(item => (
                        <li
                            key={item._id}
                            style={{ backgroundImage: `url(${item.cover})` }}
                            onClick={() => {
                                editGallery(item._id);
                            }}
                        >
                            <div className="galleryTitleBox">
                                <span>{item.title}</span>
                            </div>
                            <div className="galleryDescr">{item.descr}</div>
                            <div className="galleryMask"></div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Gallery;
