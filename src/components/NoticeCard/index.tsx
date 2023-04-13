import { LoadingOutlined } from '@ant-design/icons';
import { clearCache, useRequest, useResetState } from 'ahooks';
import { message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import classNames from 'classnames';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';

import { getWhereDataAPI } from '@/utils/apis/getWhereData';
import { updateDataAPI } from '@/utils/apis/updateData';
import { _, isAdmin } from '@/utils/cloudBase';
import { failText, noticeId, staleTime, visitorText } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';

import CustomModal from '../CustomModal';
import Emoji from '../Emoji';
import s from './index.scss';

const NoticeCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notice, setNotice, resetNotice] = useResetState('');

  const { data, loading, run } = useRequest(
    () => getWhereDataAPI(DB.Notice, { _id: _.eq(noticeId) }),
    {
      retryCount: 3,
      cacheKey: `${DB.Notice}-data`,
      staleTime
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
      message.warning('请输入公告内容~');
      return;
    }
    if (!isAdmin()) {
      message.warning(visitorText);
      return;
    }
    updateDataAPI(DB.Notice, noticeId, { notice }).then(res => {
      if (!res.success && !res.permission) {
        message.warning(visitorText);
      } else if (res.success && res.permission) {
        message.success('修改成功！');
        modalCancel();
        flushSync(() => clearCache(`${DB.Notice}-data`));
        flushSync(() => run());
      } else {
        message.warning(failText);
      }
    });
  };

  const render = () => (
    <>
      <TextArea
        placeholder='请输入公告内容'
        maxLength={21 * 4}
        allowClear
        showCount
        value={notice}
        onChange={e => setNotice(e.target.value)}
        style={{
          fontSize: 16,
          height: 140,
          resize: 'none'
        }}
      />
      <Emoji />
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
          {data?.data[0]?.notice || <LoadingOutlined />}
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
