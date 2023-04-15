import { ClearOutlined } from '@ant-design/icons';
import { useRequest, useResetState, useTitle } from 'ahooks';
import { Input, Select } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';

import MyButton from '@/components/MyButton';
import MyTable from '@/components/MyTable';
import PageHeader from '@/components/PageHeader';
import { getDataAPI } from '@/utils/apis/getData';
import { getWhereOrderPageDataAPI } from '@/utils/apis/getWhereOrderPageData';
import { _ } from '@/utils/cloudBase';
import { defaultPageSize, siteTitle, staleTime } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';
import { usePage } from '@/utils/hooks/usePage';
import { useTableData } from '@/utils/hooks/useTableData';

import { Title } from '../titleConfig';
import { useColumns } from './config';

const { Option } = Select;

const Article: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Articles}`);

  const { page, setPage } = usePage();

  const [title, setTitle, resetTitle] = useResetState('');

  const [searchClass, setSearchClass, resetSearchClass] = useResetState(null);
  const [searchTag, setSearchTag, resetSearchTag] = useResetState([]);

  const {
    data: articleData,
    total: articleTotal,
    loading: articleLoading,
    handleDelete
  } = useTableData({
    DBName: DB.Article,
    page,
    setPage
  });

  const { data: classData } = useRequest(() => getDataAPI(DB.Class), {
    retryCount: 3,
    cacheKey: `${DB.Class}-data`,
    staleTime
  });

  const { data: tagData } = useRequest(() => getDataAPI(DB.Tag), {
    retryCount: 3,
    cacheKey: `${DB.Tag}-data`,
    staleTime
  });

  const {
    data: searchClassRes,
    loading: searchClassLoading,
    run: searchClassRun
  } = useRequest(
    () =>
      getWhereOrderPageDataAPI({
        dbName: DB.Article,
        where: searchClass ? { classes: _.eq(searchClass) } : {},
        page,
        size: defaultPageSize
      }),
    {
      manual: true,
      retryCount: 3,
      cacheKey: `${DB.Article}-classIs:${searchClass}-${page}-data`,
      staleTime,
      onSuccess: res => {
        console.log(res);
      }
    }
  );

  const searchByClass = () => {
    flushSync(() => setPage(1));
    resetTitle();
    resetSearchTag();
    flushSync(() => searchClassRun());
  };

  const searchByTag = () => {};

  const handleEdit = (id: string) => {
    console.log(id);
  };

  const columns = useColumns({
    handleEdit,
    handleDelete,
    deleteProps: {
      page,
      setPage
    }
  });

  const clearSearch = () => {
    resetTitle();
    resetSearchClass();
    resetSearchTag();
  };

  const render = () => (
    <>
      <Input
        size='large'
        placeholder='输入文章标题'
        style={{ width: 400, marginRight: 5 }}
        value={title}
        onChange={e => setTitle(e.target.value)}
        allowClear
      />
      <Select
        size='large'
        placeholder='请选择文章分类'
        style={{ width: 300, marginRight: 5 }}
        showSearch
        allowClear
        value={searchClass}
        onChange={value => {
          flushSync(() => setSearchClass(value));
          searchByClass();
        }}
        options={(classData?.data || []).map(
          ({ class: classText }: { class: string }) => ({
            value: classText,
            label: classText
          })
        )}
      />
      <Select
        size='large'
        mode='multiple'
        placeholder='请选择文章标签'
        style={{ width: 500, marginRight: 5 }}
        maxTagCount={4}
        showSearch
        showArrow
        allowClear
        value={searchTag}
        onChange={value => setSearchTag(value)}
        options={(tagData?.data || []).map(({ tag }: { tag: string }) => ({
          value: tag,
          label: tag
        }))}
      />
      <MyButton
        content={<ClearOutlined />}
        style={{ width: 40, borderRadius: 8, fontSize: 18 }}
        onClick={clearSearch}
      />
    </>
  );

  return (
    <>
      <PageHeader text='写文章' onClick={() => {}} render={render} />
      <MyTable
        loading={articleLoading}
        columns={columns}
        data={articleData}
        total={articleTotal}
        page={page}
        setPage={setPage}
      />
    </>
  );
};

export default Article;
