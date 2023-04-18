import './index.custom.scss';

import { Button, Input, Message, Select } from '@arco-design/web-react';
import { useMount, useRequest, useTitle, useUpdate } from 'ahooks';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { BiBrushAlt, BiSearch } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

import MyTable from '@/components/MyTable';
import PageHeader from '@/components/PageHeader';
import { getDataAPI } from '@/utils/apis/getData';
import { _ } from '@/utils/cloudBase';
import { defaultPageSize, siteTitle, staleTime } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';
import { getTotalPage, isSubset, myClearCache } from '@/utils/functions';
import { useMyParams } from '@/utils/hooks/useMyParams';
import { usePage } from '@/utils/hooks/usePage';
import { useTableData } from '@/utils/hooks/useTableData';
import { useUpdateData } from '@/utils/hooks/useUpdateData';

import { Title } from '../titleConfig';
import { useColumns } from './config';
import s from './index.scss';

const Article: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Articles}`);
  const navigate = useNavigate();

  const { page, setPage } = usePage();
  const [showSearchData, setShowSearchData] = useState(false);
  const [searchData, setSearchData] = useState([]);

  const {
    searchTitle,
    searchClass,
    searchTag,
    setSearchTitle,
    setSearchClass,
    setSearchTag,
    clearSearch
  } = useMyParams();

  useMount(() => {
    if (searchTitle || searchClass || searchTag.length) {
      setShowSearchData(true);
    }
  });

  const {
    data: articleData,
    total: articleTotal,
    loading: articleLoading,
    handleDelete,
    dataRun,
    totalRun
  } = useTableData({
    DBName: DB.Article,
    page,
    setPage
  });

  useUpdateData(
    () =>
      myClearCache({
        DBName: DB.Article,
        page: 1,
        totalPage: getTotalPage(articleTotal, defaultPageSize),
        deleteTotal: true
      }),
    () => {
      dataRun();
      totalRun();
    }
  );

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

  const { run: searchRun, loading: searchLoading } = useRequest(
    () => getDataAPI(DB.Article),
    {
      manual: true,
      retryCount: 3,
      cacheKey: `${DB.Article}-${searchTitle}-${searchClass}-${JSON.stringify(
        searchTag
      )}-searchRes`,
      staleTime,
      throttleWait: 1000,
      onSuccess: res => {
        const result = res.data.filter(
          ({
            title,
            classes,
            tags
          }: {
            title: string;
            classes: string;
            tags: string[];
          }) => {
            const titleCondition =
              title.toLowerCase().indexOf((searchTitle || '').toLowerCase()) !== -1;
            const tagCondition = isSubset(tags, searchTag);
            const classCondition = searchClass ? classes === searchClass : true;
            return titleCondition && tagCondition && classCondition;
          }
        );
        setSearchData(result);
        setPage(1);
        setShowSearchData(true);
        Message.success('搜索成功！');
      }
    }
  );

  useMount(() => {
    if (searchTitle || searchClass || searchTag.length) {
      searchRun();
    }
  });

  const handleEdit = (id: string) => {
    console.log(id);
  };

  const search = () => {
    if (!searchTitle && !searchClass && !searchTag.length) {
      Message.info('请选择搜索内容！');
      return;
    }
    searchRun();
  };

  const columns = useColumns({
    handleEdit,
    handleDelete,
    deleteProps: {
      page,
      setPage
    }
  });

  const render = () => (
    <div className={s.searchBox}>
      <div className={s.search}>
        <Input
          size='large'
          allowClear
          style={{ flex: 1, marginRight: 10 }}
          className='articleInputBox'
          placeholder='输入文章标题'
          value={searchTitle}
          onChange={value => setSearchTitle(value)}
          onPressEnter={search}
        />
        <Select
          size='large'
          placeholder='请选择文章分类'
          style={{ flex: 1, marginRight: 10 }}
          allowCreate={false}
          showSearch
          allowClear
          unmountOnExit={false}
          value={searchClass}
          onChange={value => setSearchClass(value)}
          disabled={classLoading}
          options={
            classData?.data.map(({ class: classText }: { class: string }) => ({
              value: classText,
              label: classText
            })) || undefined
          }
        />

        <Select
          placeholder='请选择文章标签'
          size='large'
          style={{ flex: 2, marginRight: 10 }}
          maxTagCount={4}
          mode='multiple'
          allowCreate={false}
          showSearch
          allowClear
          unmountOnExit={false}
          value={searchTag}
          onChange={value => setSearchTag(value)}
          disabled={tagLoading}
          options={
            tagData?.data.map(({ tag }: { tag: string }) => ({
              value: tag,
              label: tag
            })) || undefined
          }
        />
      </div>
      <div>
        <Button
          type='primary'
          size='large'
          onClick={search}
          style={{ fontSize: 16, marginRight: 10 }}
        >
          <BiSearch />
        </Button>
        <Button
          type='primary'
          size='large'
          onClick={() => {
            flushSync(() => clearSearch());
            flushSync(() => setPage(1));
            setShowSearchData(false);
          }}
          style={{ fontSize: 16 }}
        >
          <BiBrushAlt />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader
        text='写文章'
        onClick={() => navigate(`/admin/addArticle`)}
        render={render}
      />
      <MyTable
        loading={showSearchData ? searchLoading : articleLoading}
        columns={columns}
        data={showSearchData ? searchData : articleData}
        // data={articleData}
        total={showSearchData ? searchData.length : articleTotal}
        // total={articleTotal}
        page={page}
        setPage={setPage}
      />
    </>
  );
};

export default Article;
