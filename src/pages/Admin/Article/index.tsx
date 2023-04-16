import { ClearOutlined, SearchOutlined } from '@ant-design/icons';
import { useKeyPress, useMount, useRequest, useResetState, useTitle } from 'ahooks';
import { Input, message, Select } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';

import MyButton from '@/components/MyButton';
import MyTable from '@/components/MyTable';
import PageHeader from '@/components/PageHeader';
import { getDataAPI } from '@/utils/apis/getData';
import { getWhereOrderPageDataAPI } from '@/utils/apis/getWhereOrderPageData';
import { _, db } from '@/utils/cloudBase';
import { defaultPageSize, siteTitle, staleTime } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';
import { isSubset } from '@/utils/functions';
import { useMyParams } from '@/utils/hooks/useMyParams';
import { usePage } from '@/utils/hooks/usePage';
import { useTableData } from '@/utils/hooks/useTableData';

import { Title } from '../titleConfig';
import { useColumns } from './config';

const { Option } = Select;

const Article: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Articles}`);

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
    handleDelete
  } = useTableData({
    DBName: DB.Article,
    page,
    setPage
  });

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
      retryCount: 3,
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
      }
    }
  );

  const handleEdit = (id: string) => {
    console.log(id);
  };

  const search = () => {
    if (!searchTitle && !searchClass && !searchTag.length) {
      message.info('请选择搜索内容！');
      return;
    }

    searchRun();
  };

  useKeyPress(13, () => search());

  const columns = useColumns({
    handleEdit,
    handleDelete,
    deleteProps: {
      page,
      setPage
    }
  });

  const render = () => (
    <>
      <Input
        size='large'
        placeholder='输入文章标题'
        style={{ width: 400, marginRight: 5 }}
        value={searchTitle}
        onChange={e => setSearchTitle(e.target.value)}
        allowClear
      />
      <Select
        size='large'
        placeholder='请选择文章分类'
        style={{ width: 300, marginRight: 5 }}
        showSearch
        allowClear
        value={searchClass}
        onChange={value => setSearchClass(value)}
        disabled={classLoading}
        options={
          classData?.data.map(({ class: classText }: { class: string }) => ({
            value: classText,
            label: classText
          })) || []
        }
      />
      <Select
        size='large'
        mode='tags'
        placeholder='请选择文章标签'
        style={{ width: 500, marginRight: 5 }}
        maxTagCount={4}
        showSearch
        showArrow
        allowClear
        value={searchTag}
        onChange={value => setSearchTag(value)}
        disabled={tagLoading}
        options={
          tagData?.data.map(({ tag }: { tag: string }) => ({
            value: tag,
            label: tag
          })) || []
        }
      />
      <MyButton
        content={<SearchOutlined />}
        style={{ width: 40, borderRadius: 8, fontSize: 18, marginRight: 5 }}
        onClick={search}
      />
      <MyButton
        content={<ClearOutlined />}
        style={{ width: 40, borderRadius: 8, fontSize: 18 }}
        onClick={() => {
          flushSync(() => clearSearch());
          flushSync(() => setPage(1));
          setShowSearchData(false);
        }}
      />
    </>
  );

  return (
    <>
      <PageHeader text='写文章' onClick={() => {}} render={render} />
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
