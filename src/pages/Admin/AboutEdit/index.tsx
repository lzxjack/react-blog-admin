import { useEventListener, useRequest, useThrottleFn, useTitle } from 'ahooks';
import { message } from 'antd';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import MarkDown from '@/components/MarkDown';
import MyButton from '@/components/MyButton';
import PageHeader from '@/components/PageHeader';
import { getDataAPI } from '@/utils/apis/getData';
import { updateDataAPI } from '@/utils/apis/updateData';
import { isAdmin } from '@/utils/cloudBase';
import { failText, siteTitle, visitorText } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';

import { Title } from '../titleConfig';
import s from './index.scss';

const AboutEdit: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isMe = searchParams.get('me') === '1';

  useTitle(`${siteTitle} | ${isMe ? Title.AboutMe : Title.AboutSite}`);

  const navigate = useNavigate();

  const [content, setContent] = useState('');
  const [id, setId] = useState('');

  useRequest(() => getDataAPI(DB.About), {
    onSuccess: res => {
      setContent(res?.data[isMe ? 1 : 0].content);
      setId(res?.data[isMe ? 1 : 0]._id);
    }
  });

  const updateAbout = () => {
    if (!content) {
      message.info('请写点什么再更新！');
      return;
    }
    if (!isAdmin()) {
      message.warning(visitorText);
      return;
    }
    updateDataAPI(DB.About, id, { content }).then(res => {
      if (!res.success && !res.permission) {
        message.warning(visitorText);
      } else if (res.success && res.permission) {
        message.success('更新成功！');
        navigate(`/admin/about?updated=1`);
      } else {
        message.warning(failText);
      }
    });
  };

  const render = () => (
    <>
      <div className={s.aboutTitle}>关于{isMe ? '我' : '本站'}</div>
      <MyButton content='更新' className={s.aboutUpdate} onClick={updateAbout} />
    </>
  );

  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const left = leftRef.current! as any;
  const right = rightRef.current! as any;

  const handleScroll = (event: any) => {
    const scrollTopRatio =
      event.target.scrollTop / (event.target.scrollHeight - event.target.clientHeight);
    if (event.target === left) {
      right.scrollTop = scrollTopRatio * (right.scrollHeight - right.clientHeight);
    } else if (event.target === right) {
      left.scrollTop = scrollTopRatio * (left.scrollHeight - left.clientHeight);
    }
  };

  const { run: handleScrollRun } = useThrottleFn(handleScroll, { wait: 60 });

  return (
    <>
      <PageHeader text='返回' onClick={() => navigate('/admin/about')} render={render} />
      <div className={s.markedEditBox}>
        <textarea
          ref={leftRef}
          className={classNames(s.markedEdit, s.input)}
          value={content}
          onChange={e => setContent(e.target.value)}
          onScroll={handleScrollRun}
        />
        <MarkDown
          ref={rightRef}
          className={s.markedEdit}
          content={content}
          onScroll={handleScrollRun}
        />
      </div>
    </>
  );
};

export default AboutEdit;
