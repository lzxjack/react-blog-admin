import { useSafeState, useTitle } from 'ahooks';
import { Table } from 'antd';
import React from 'react';

import PageHeader from '@/components/PageHeader';
import { pageSize, siteTitle } from '@/utils/constant';
import { useMyRequest } from '@/utils/myRequest';

import { Title } from '../titleConfig';
import { useColumns } from './config';

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

  const {
    data,
    sum: total,
    loading
  } = useMyRequest({ index: 'link', page, size: pageSize });

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
        dataSource={data}
        rowKey={columns => columns._id}
        showSorterTooltip={false}
        pagination={{
          current: page,
          total,
          defaultPageSize: pageSize,
          showSizeChanger: false,
          showTitle: false,
          onChange: (page: number) => setPage(page)
        }}
      />
    </>
  );
};

export default Link;
