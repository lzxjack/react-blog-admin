import { useRequest, useSafeState, useTitle } from 'ahooks';
import { Table } from 'antd';
import React from 'react';

import Loading from '@/components/Loading';
import PageHeader from '@/components/PageHeader';
import { DB } from '@/utils/apis/dbConfig';
import { getPageData } from '@/utils/apis/getPageData';
import { siteTitle, size, staleTime } from '@/utils/constant';

import { Title } from '../titleConfig';
import { useColumns } from './config';
import s from './index.scss';

const Link: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Link}`);
  const [page, setPage] = useSafeState(1);

  const editLink = (id: string) => {
    // TODO:
    console.log(id);
  };

  const deleteLink = (id: string) => {
    // TODO:
    console.log(id);
  };

  const columns = useColumns({ editLink, deleteLink });

  const { data, loading } = useRequest(
    () =>
      getPageData({
        dbName: DB.Link,
        page,
        size
      }),
    {
      retryCount: 3,
      refreshDeps: [page],
      cacheKey: `${DB.Link}-${page}`,
      staleTime
    }
  );

  return (
    <>
      <PageHeader
        text='添加友链'
        onClick={() => {
          console.log(123);
        }}
      />
      <Table
        size='middle'
        bordered
        loading={loading}
        columns={columns}
        dataSource={data?.data}
        rowKey={columns => columns._id}
        showSorterTooltip={false}
      />
    </>
  );
};

export default Link;
