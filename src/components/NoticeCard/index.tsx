import { Input, Message } from '@arco-design/web-react';
import { IconLoading } from '@arco-design/web-react/icon';
import { clearCache, useRequest, useResetState } from 'ahooks';
import classNames from 'classnames';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';

import { getWhereDataAPI } from '@/utils/apis/getWhereData';
import { updateDataAPI } from '@/utils/apis/updateData';
import { _, isAdmin } from '@/utils/cloudBase';
import { failText, noticeId, visitorText } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';

import CustomModal from '../CustomModal';
import Emoji from '../Emoji';
import s from './index.scss';

const { TextArea } = Input;

const NoticeCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notice, setNotice, resetNotice] = useResetState('');

  const { data, loading, run } = useRequest(
    () => getWhereDataAPI(DB.Notice, { _id: _.eq(noticeId) }),
    {
      retryCount: 3
    }
  );

  const openModal = () => {
    setIsModalOpen(true);
    setNotice(data?.data[0]?.notice);
  };

  const modalCancel = () => {
    setIsModalOpen(false);
    resetNotice();
  };

  const modalOk = () => {
    if (!notice) {
      Message.warning('请输入公告内容~');
      return;
    }
    if (!isAdmin()) {
      Message.warning(visitorText);
      return;
    }
    updateDataAPI(DB.Notice, noticeId, { notice }).then(res => {
      if (!res.success && !res.permission) {
        Message.warning(visitorText);
      } else if (res.success && res.permission) {
        Message.success('修改成功！');
        modalCancel();
        flushSync(() => clearCache(`${DB.Notice}-data`));
        flushSync(() => run());
      } else {
        Message.warning(failText);
      }
    });
  };

  const render = () => (
    <>
      <TextArea
        placeholder='请输入公告内容'
        maxLength={21 * 4}
        allowClear
        showWordLimit
        value={notice}
        onChange={value => setNotice(value)}
        autoSize={false}
        style={{
          height: 100,
          resize: 'none'
        }}
      />
      <Emoji style={{ marginTop: 10 }} />
    </>
  );

  return (
    <>
      <div className={s.cardBox}>
        <div className={s.title}>公告</div>
        <div
          className={classNames(s.noticeText, { [s.loading]: loading })}
          onClick={openModal}
        >
          {loading ? <IconLoading /> : data?.data[0]?.notice || ''}
        </div>
      </div>
      <CustomModal
        isEdit={true}
        isModalOpen={isModalOpen}
        DBType={DB.Notice}
        modalOk={modalOk}
        modalCancel={modalCancel}
        render={render}
      />
    </>
  );
};

export default NoticeCard;
