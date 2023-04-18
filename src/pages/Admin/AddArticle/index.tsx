import { Button, Input, Message, Select } from '@arco-design/web-react';
import { useRequest, useTitle } from 'ahooks';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MarkDown from '@/components/MarkDown';
import { addDataAPI } from '@/utils/apis/addData';
import { getDataAPI } from '@/utils/apis/getData';
import { failText, siteTitle, staleTime, visitorText } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';
import { containsChineseCharacters, isValidDateString } from '@/utils/functions';
import { useScrollSync } from '@/utils/hooks/useScrollSync';

import { Title } from '../titleConfig';
import s from './index.scss';

const AddArticle: React.FC = () => {
  // TODO: 添加 or 编辑
  useTitle(`${siteTitle} | ${Title.AddArticle}`);
  const navigate = useNavigate();

  const { leftRef, rightRef, handleScrollRun } = useScrollSync();

  const [title, setTitle] = useState('');
  const [titleEng, setTitleEng] = useState('');
  const [classText, setClassText] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD HH:mm:ss'));
  const [content, setContent] = useState('');

  const { data: classData, loading: classLoading } = useRequest(
    () => getDataAPI(DB.Class),
    {
      retryCount: 3,
      cacheKey: `${DB.Class}-data`,
      staleTime
    }
  );

  const { data: tagData, loading: tagLoading } = useRequest(() => getDataAPI(DB.Tag), {
    retryCount: 3,
    cacheKey: `${DB.Tag}-data`,
    staleTime
  });

  const postArticle = (type: 'post' | 'draft') => {
    if (!title || !titleEng || !date || !content) {
      Message.info('请至少输入中英文标题、时间、正文！');
      return;
    }
    if (containsChineseCharacters(titleEng)) {
      Message.info('英文标题不能含有中文字符！');
      return;
    }
    if (!isValidDateString(date, true)) {
      Message.info('日期字符串不合法！');
      return;
    }

    const successText = type === 'post' ? '发布文章成功！' : '保存草稿成功！';
    const path = type === 'post' ? '/admin/article' : '/admin/draft';

    const data = {
      title,
      titleEng,
      content,
      tags,
      classes: classText,
      date: new Date(date).getTime(),
      url: `https://lzxjack.top/post?title=${titleEng}`,
      post: type === 'post'
    };

    addDataAPI(DB.Article, data).then(res => {
      if (!res.success && !res.permission) {
        Message.warning(visitorText);
      } else if (res.success && res.permission) {
        Message.success(successText);
        navigate(`${path}?updated=1`);
      } else {
        Message.warning(failText);
      }
    });
  };

  return (
    <>
      <div className={s.addArticleHeader}>
        <div className={s.top}>
          <Input
            className={s.chineseTitle}
            style={{ width: 600 }}
            addBefore='中文标题'
            allowClear
            size='large'
            value={title}
            onChange={value => setTitle(value)}
          />
          <Input
            style={{ width: 400, marginRight: 10 }}
            addBefore='英文标题'
            allowClear
            size='large'
            value={titleEng}
            onChange={value => setTitleEng(value)}
          />
          <Button
            size='large'
            type='primary'
            style={{ marginRight: 10 }}
            onClick={() => postArticle('draft')}
          >
            存为草稿
          </Button>
          <Button
            size='large'
            type='primary'
            status='success'
            onClick={() => postArticle('post')}
          >
            发布文章
          </Button>
        </div>
        <div className={s.bottom}>
          <Select
            addBefore='分类'
            size='large'
            className={s.classText}
            allowCreate={false}
            showSearch
            allowClear
            unmountOnExit={false}
            value={classText}
            onChange={value => setClassText(value)}
            disabled={classLoading}
            options={
              classData?.data.map(({ class: classText }: { class: string }) => ({
                value: classText,
                label: classText
              })) || undefined
            }
          />
          <Select
            addBefore='标签'
            size='large'
            className={s.tags}
            maxTagCount={6}
            mode='multiple'
            allowCreate={false}
            showSearch
            allowClear
            unmountOnExit={false}
            value={tags}
            onChange={value => setTags(value)}
            disabled={tagLoading}
            options={
              tagData?.data.map(({ tag }: { tag: string }) => ({
                value: tag,
                label: tag
              })) || undefined
            }
          />
          <Input
            addBefore='时间'
            value={date}
            placeholder='YYYY-MM-DD HH:mm:ss'
            onChange={value => setDate(value)}
            className={s.time}
            allowClear
            size='large'
          />
        </div>
      </div>
      <div className={s.contentEdit}>
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

export default AddArticle;
