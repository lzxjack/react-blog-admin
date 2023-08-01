import { Button, Message } from '@arco-design/web-react';
import { useMount, useTitle } from 'ahooks';
import classNames from 'classnames';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import MarkDown from '@/components/MarkDown';
import PageHeader from '@/components/PageHeader';
import { selectAbout } from '@/redux/selectors';
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

  const about = useSelector(selectAbout);

  useMount(() => {
    const aboutContent = isMe ? about.aboutMe.value : about.aboutSite.value;
    const id = isMe ? about.aboutMe.id : about.aboutSite.id;
    setContent(aboutContent);
    setId(id);
  });

  const updateAbout = () => {
    if (!content) {
      Message.info('请写点什么再更新！');
      return;
    }
    if (!isAdmin()) {
      Message.warning(visitorText);
      return;
    }
    updateDataAPI(DB.About, id, { content }).then(res => {
      if (!res.success && !res.permission) {
        Message.warning(visitorText);
      } else if (res.success && res.permission) {
        Message.success('更新成功！');
        navigate(`/admin/about?updated=1`);
      } else {
        Message.warning(failText);
      }
    });
  };

  const render = () => (
    <>
      <div className={s.aboutTitle}>关于{isMe ? '我' : '本站'}</div>
      <Button size='large' type='primary' className={s.aboutUpdate} onClick={updateAbout}>
        更新
      </Button>
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
