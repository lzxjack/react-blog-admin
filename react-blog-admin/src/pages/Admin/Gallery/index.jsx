import { connect } from 'react-redux';
import './index.css';

const Gallery = props => {
    const editGallery = id => {
        props.history.push(`/admin/addGallery?id=${id}`);
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
                    {props.galleries.map(item => (
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

export default connect(state => ({ galleries: state.galleries }), {})(Gallery);
