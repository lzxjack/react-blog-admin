import { Button, Input, Select } from '@arco-design/web-react';
import { useTitle } from 'ahooks';
import classNames from 'classnames';
import React from 'react';

import MarkDown from '@/components/MarkDown';
import { siteTitle } from '@/utils/constant';
import { useScrollSync } from '@/utils/hooks/useScrollSync';

import { Title } from '../titleConfig';
import s from './index.scss';

const { Option } = Select;

const AddArticle: React.FC = () => {
  // TODO: 添加 or 编辑
  useTitle(`${siteTitle} | ${Title.AddArticle}`);

  const { leftRef, rightRef, handleScrollRun } = useScrollSync();

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
          />
          <Input
            style={{ width: 400, marginRight: 10 }}
            addBefore='英文标题'
            allowClear
            size='large'
          />
          <Button size='large' type='primary' style={{ marginRight: 10 }}>
            存为草稿
          </Button>
          <Button size='large' type='primary' status='success'>
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
          >
            <Option value='123'>123</Option>
          </Select>
          <Select
            addBefore='标签'
            size='large'
            className={s.tags}
            mode='multiple'
            allowCreate={false}
            showSearch
            allowClear
            unmountOnExit={false}
          >
            <Option value='321'>312</Option>
            <Option value='1'>1</Option>
            <Option value='2'>2</Option>
          </Select>
          <Input addBefore='时间' className={s.time} allowClear size='large' />
        </div>
      </div>
      <div className={s.contentEdit}>
        <textarea
          ref={leftRef}
          className={classNames(s.markedEdit, s.input)}
          // value={content}
          // onChange={e => setContent(e.target.value)}
          onScroll={handleScrollRun}
        />
        <MarkDown
          ref={rightRef}
          className={s.markedEdit}
          content='123'
          onScroll={handleScrollRun}
        />
      </div>
    </>
  );
};

export default AddArticle;
