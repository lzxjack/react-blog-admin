import { useRequest, useTitle } from 'ahooks';
import { message } from 'antd';
import classNames from 'classnames';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import MarkDown from '@/components/MarkDown';
import MyButton from '@/components/MyButton';
import PageHeader from '@/components/PageHeader';
import { getDataAPI } from '@/utils/apis/getData';
import { updateDataAPI } from '@/utils/apis/updateData';
import { isAdmin } from '@/utils/cloudBase';
import { failText, siteTitle, visitorText } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';
import { useScrollSync } from '@/utils/hooks/useScrollSync';

import { Title } from '../titleConfig';
import s from './index.scss';

const AboutEdit: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isMe = searchParams.get('me') === '1';

  useTitle(`${siteTitle} | ${isMe ? Title.AboutMe : Title.AboutSite}`);

  const { leftRef, rightRef, handleScrollRun } = useScrollSync();

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
