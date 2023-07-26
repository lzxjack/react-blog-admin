import { Input, Message } from '@arco-design/web-react';
import { IconLoading } from '@arco-design/web-react/icon';
import { useMemoizedFn, useMount, useRequest, useResetState } from 'ahooks';
import classNames from 'classnames';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import { selectNotice } from '@/redux/selectors';
import { setNotice } from '@/redux/slices/notice';
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
  const [notice, setLocalNotice, resetLocalNotice] = useResetState('');

  const reduxNotice = useSelector(selectNotice);
  const dispatch = useDispatch();

  const { loading, run } = useRequest(
    () => getWhereDataAPI(DB.Notice, { _id: _.eq(noticeId) }),
    {
      retryCount: 3,
      manual: true,
      onSuccess: res => {
        dispatch(setNotice(res.data[0].notice));
      }
    }
  );

  useMount(() => {
    if (!reduxNotice.isDone) {
      run();
    }
  });

  const openModal = useMemoizedFn(() => {
    setIsModalOpen(true);
    setLocalNotice(reduxNotice.value);
  });

  const modalCancel = useMemoizedFn(() => {
    setIsModalOpen(false);
    resetLocalNotice();
  });

  const modalOk = useMemoizedFn(() => {
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
        flushSync(() => run());
      } else {
        Message.warning(failText);
      }
    });
  });

  const render = useMemoizedFn(() => (
    <>
      <TextArea
        placeholder='请输入公告内容'
        maxLength={21 * 4}
        allowClear
        showWordLimit
        value={notice}
        onChange={value => setLocalNotice(value)}
        autoSize={false}
        style={{
          height: 100,
          resize: 'none'
        }}
      />
      <Emoji style={{ marginTop: 10 }} />
    </>
  ));

  return (
    <>
      <div className={s.cardBox}>
        <div className={s.title}>公告</div>
        <div
          className={classNames(s.noticeText, { [s.loading]: loading })}
          onClick={openModal}
        >
          {loading ? <IconLoading /> : reduxNotice.value}
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
