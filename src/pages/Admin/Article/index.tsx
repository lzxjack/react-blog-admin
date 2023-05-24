import './index.custom.scss';

import { Button, Input, Message, Select } from '@arco-design/web-react';
import { useMount, useRequest, useTitle } from 'ahooks';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { BiBrushAlt, BiSearch } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import MyTable from '@/components/MyTable';
import PageHeader from '@/components/PageHeader';
import { selectClass, selectTag } from '@/redux/selectors';
import { resetClasses, setClasses } from '@/redux/slices/classes';
import { resetDraftData } from '@/redux/slices/drafts';
import { setTags } from '@/redux/slices/tags';
import { deleteDataAPI } from '@/utils/apis/deleteData';
import { getDataAPI } from '@/utils/apis/getData';
import { getWhereDataAPI } from '@/utils/apis/getWhereData';
import { _, isAdmin } from '@/utils/cloudBase';
import { defaultPageSize, failText, siteTitle, visitorText } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';
import { classCountChange, getAfterDeletedPage, isSubset } from '@/utils/functions';
import { useMyParams } from '@/utils/hooks/useMyParams';
import { usePage } from '@/utils/hooks/usePage';
import { DeleteProps, useTableData } from '@/utils/hooks/useTableData';
import { useUpdateData } from '@/utils/hooks/useUpdateData';
import { reduxMap } from '@/utils/reduxMap';

import { Title } from '../titleConfig';
import { useColumns } from './config';
import s from './index.scss';

const Article: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Articles}`);
  const navigate = useNavigate();

  const { page, setPage } = usePage();
  const [showSearchData, setShowSearchData] = useState(false);
  const [searchData, setSearchData] = useState<any[]>([]);

  const {
    searchTitle,
    searchClass,
    searchTag,
    setSearchTitle,
    setSearchClass,
    setSearchTag,
    clearSearch
  } = useMyParams();

  const classes = useSelector(selectClass);
  const tags = useSelector(selectTag);

  const dispatch = useDispatch();

  const { loading: classLoading, run: classesRun } = useRequest(
    () => getDataAPI(DB.Class),
    {
      retryCount: 3,
      manual: true,
      onSuccess: res => {
        dispatch(setClasses(res.data));
      }
    }
  );

  const { loading: tagLoading, run: tagsRun } = useRequest(() => getDataAPI(DB.Tag), {
    retryCount: 3,
    manual: true,
    onSuccess: res => {
      dispatch(setTags(res.data));
    }
  });

  useMount(() => {
    if (!classes.isDone) {
      classesRun();
    }
    if (!tags.isDone) {
      tagsRun();
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
    type: DB.Article,
    DBName: DB.Article,
    page,
    setPage,
    where: { post: _.eq(true) },
    classesRun
  });

  useUpdateData([
    {
      key: 'updated',
      run: () => {
        dataRun();
        totalRun();
      }
    },
    {
      key: 'clearOther',
      run: () => {
        dispatch(resetDraftData());
      }
    }
  ]);

  // TODO: 自己写API
  const { run: searchRun, loading: searchLoading } = useRequest(
    () => getWhereDataAPI(DB.Article, { post: _.eq(true) }),
    {
      manual: true,
      retryCount: 3,
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
            const classCondition = searchClass
              ? classes === (searchClass === '未分类' ? '' : searchClass)
              : true;
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
      setShowSearchData(true);
    }
  });

  const handleEdit = (id: string) => {
    navigate(`/admin/addArticle?id=${id}&from=article`);
  };

  const search = () => {
    if (!searchTitle && !searchClass && !searchTag.length) {
      Message.info('请选择搜索内容！');
      return;
    }
    searchRun();
  };

  const handleDeleteSearch = (id: string, { page, setPage }: DeleteProps) => {
    if (!isAdmin()) {
      Message.warning(visitorText);
      return;
    }

    deleteDataAPI(DB.Article, id).then(res => {
      if (!res.success && !res.permission) {
        Message.warning(visitorText);
      } else if (res.success && res.permission) {
        Message.success('删除成功！');
        const newSearchData = searchData.filter(({ _id }: { _id: string }) => _id !== id);
        const classText = searchData.filter(({ _id }: { _id: string }) => _id === id)[0]
          .classes;
        classCountChange(classText, 'min', () => {
          dispatch(resetClasses());
        });
        flushSync(() => setSearchData(newSearchData));
        flushSync(() => {
          dispatch(reduxMap[DB.Article].dataResetReducer());
          setPage(getAfterDeletedPage(searchData.length, page, defaultPageSize));
        });
        flushSync(() => {
          dataRun();
          totalRun();
        });
      } else {
        Message.warning(failText);
      }
    });
  };

  const columns = useColumns({
    showSearchData,
    handleEdit,
    handleDelete,
    handleDeleteSearch,
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
          options={[
            ...classes.value.map(({ class: classText }: { class: string }) => ({
              value: classText,
              label: classText
            })),
            { value: '未分类', label: '未分类' }
          ]}
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
          options={tags.value.map(({ tag }: { tag: string }) => ({
            value: tag,
            label: tag
          }))}
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
        loading={searchLoading || articleLoading}
        columns={columns}
        data={
          showSearchData
            ? searchData.slice(defaultPageSize * (page - 1), defaultPageSize * page)
            : articleData
        }
        total={showSearchData ? searchData.length : articleTotal}
        page={page}
        setPage={setPage}
      />
    </>
  );
};

export default Article;
