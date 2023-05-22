import { Button, Input, Message, Select } from '@arco-design/web-react';
import { useMount, useRequest, useTitle } from 'ahooks';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import MarkDown from '@/components/MarkDown';
import { selectClass, selectTag } from '@/redux/selectors';
import { setClasses } from '@/redux/slices/classes';
import { setTags } from '@/redux/slices/tags';
import { addDataAPI } from '@/utils/apis/addData';
import { getDataAPI } from '@/utils/apis/getData';
import { getDataByIdAPI } from '@/utils/apis/getDataById';
import { getWhereDataAPI } from '@/utils/apis/getWhereData';
import { updateDataAPI } from '@/utils/apis/updateData';
import { updateWhereDataAPI } from '@/utils/apis/updateWhereData';
import { _ } from '@/utils/cloudBase';
import { failText, siteTitle, visitorText } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';
import {
  classCountChange,
  containsChineseCharacters,
  isValidDateString
} from '@/utils/functions';
import { useScrollSync } from '@/utils/hooks/useScrollSync';

import { Title } from '../titleConfig';
import s from './index.scss';

const AddArticle: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.AddArticle}`);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { leftRef, rightRef, handleScrollRun } = useScrollSync();

  const [title, setTitle] = useState('');
  const [titleEng, setTitleEng] = useState('');
  const [classText, setClassText] = useState('');
  const [tags, setLocalTags] = useState<string[]>([]);
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD HH:mm:ss'));
  const [content, setContent] = useState('');

  // 文章/草稿 更新逻辑
  const id = searchParams.get('id');
  const from = searchParams.get('from');

  const [defaultClassText, setDefaultClassText] = useState('');

  useRequest(() => getDataByIdAPI(DB.Article, id || ''), {
    retryCount: 3,
    onSuccess: res => {
      if (!res.data.length) return;
      const { title, titleEng, classes: classText, tags, date, content } = res.data[0];
      setTitle(title);
      setTitleEng(titleEng);
      setClassText(classText);
      setLocalTags(tags);
      setDate(dayjs(date).format('YYYY-MM-DD HH:mm:ss'));
      setContent(content);
      setDefaultClassText(classText);
    }
  });

  const reduxClasses = useSelector(selectClass);
  const reduxTags = useSelector(selectTag);

  const dispatch = useDispatch();

  const {
    data: classData,
    loading: classLoading,
    run: classesRun
  } = useRequest(() => getDataAPI(DB.Class), {
    retryCount: 3,
    manual: true,
    onSuccess: res => {
      dispatch(setClasses(res.data));
    }
  });

  const {
    data: tagData,
    loading: tagLoading,
    run: tagsRun
  } = useRequest(() => getDataAPI(DB.Tag), {
    retryCount: 3,
    manual: true,
    onSuccess: res => {
      dispatch(setTags(res.data));
    }
  });

  useMount(() => {
    if (!reduxClasses.isDone) {
      classesRun();
    }
    if (!reduxTags.isDone) {
      tagsRun();
    }
  });

  const addData = (type: 'post' | 'draft', data: object) => {
    addDataAPI(DB.Article, data).then(res => {
      if (!res.success && !res.permission) {
        Message.warning(visitorText);
      } else if (res.success && res.permission) {
        Message.success(type === 'post' ? '发布文章成功！' : '保存草稿成功！');
        navigate(`${type === 'post' ? '/admin/article' : '/admin/draft'}?updated=1`);
      } else {
        Message.warning(failText);
      }
    });
  };

  const updateData = (type: 'post' | 'draft', id: string, data: object) => {
    updateDataAPI(DB.Article, id, data).then(res => {
      if (!res.success && !res.permission) {
        Message.warning(visitorText);
      } else if (res.success && res.permission) {
        Message.success(type === 'post' ? '更新文章成功！' : '保存草稿成功！');
        navigate(`${type === 'post' ? '/admin/article' : '/admin/draft'}?updated=1`);
      } else {
        Message.warning(failText);
      }
    });
  };

  // 新建页面：
  //   发布：
  //     选择了分类：classCount++
  //     未选择分类：
  //   存草稿：

  // 编辑页面：
  //   文章页进来：
  //     发布：
  //       修改了分类：
  //         新的不为空：old--，new++
  //         新的为空：old--
  //       未修改分类：
  //     存草稿：非空old--
  //   草稿页进来：
  //     发布：
  //       选择了分类：classCount++
  //       未选择分类：
  //     存草稿：

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

    if (!id) {
      // 新建页面
      addData(type, data);
      if (type === 'post') {
        // 发布
        classCountChange(classText, 'add');
      }
    } else {
      // 编辑页面
      updateData(type, id, data);
      if (from === 'article') {
        // 文章页进来
        if (type === 'post') {
          // 发布
          if (classText !== defaultClassText) {
            classCountChange(classText, 'add');
            classCountChange(defaultClassText, 'min');
          }
        } else {
          // 存草稿
          classCountChange(defaultClassText, 'min');
        }
      } else {
        // 草稿页进来
        if (type === 'post') {
          // 发布
          classCountChange(classText, 'add');
        }
      }
    }
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
            {id ? '更新' : '发布'}文章
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
            onChange={value => setLocalTags(value)}
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
