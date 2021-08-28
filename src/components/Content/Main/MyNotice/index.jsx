import { useState } from 'react';
import { connect } from 'react-redux';
import { Modal, message } from 'antd';
import { visitorText, adminUid, noticeId } from '../../../../utils/constant';
import { db, auth } from '../../../../utils/cloudBase';
import { getNotice } from '../../../../redux/actions';
import './index.css';

const MyNotice = props => {
    const [noticeEditVisible, setNoticeEditVisible] = useState(false);
    const [notice, setNotice] = useState('');

    const getNoticeFromDB = () => {
        db.collection('notice')
            .get()
            .then(res => {
                props.getNotice(res.data[0].notice);
            });
    };
    // 打开对话框
    const openNoticeEdit = () => {
        setNotice(props.notice);
        setNoticeEditVisible(true);
    };
    // 对话框取消
    const noticeEditCancel = () => {
        setNoticeEditVisible(false);
        setNotice('');
    };
    // 对话框确认
    const editNotice = () => {
        if (!notice) {
            message.info('公告不可以为空~');
            return;
        }
        if (notice === props.notice) {
            message.info('无需更改~');
            return;
        }
        if (auth.currentUser.uid !== adminUid) {
            message.warning(visitorText);
            return;
        }
        db.collection('notice')
            .doc(noticeId)
            .update({
                notice,
            })
            .then(res => {
                if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
                    message.warning(visitorText);
                    return;
                }
                message.success('更新公告成功！');
                getNoticeFromDB();
                noticeEditCancel();
            });
    };
    return (
        <div className="MyNoticeBox">
            <div className="noticeTitle">公告</div>
            <div className="noticeContoent" onDoubleClick={openNoticeEdit}>
                {props.notice}
            </div>
            <Modal
                title="更新公告"
                centered
                visible={noticeEditVisible}
                onOk={editNotice}
                onCancel={noticeEditCancel}
                width={400}
                okText="确认"
                cancelText="取消"
            >
                <textarea
                    className="noticeEditBox"
                    value={notice}
                    onChange={e => setNotice(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default connect(
    state => ({
        notice: state.notice,
    }),
    { getNotice }
)(MyNotice);
