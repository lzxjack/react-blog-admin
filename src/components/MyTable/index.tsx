import { Table } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import React from 'react';

import { pageSize } from '@/utils/constant';

interface Props {
  loading: boolean;
  columns: (ColumnGroupType<any> | ColumnType<any>)[];
  data: readonly any[];
  total: number;
  page: number;
  setPage: (page: number) => void;
}

const MyTable: React.FC<Props> = ({ loading, columns, data, total, page, setPage }) => (
  <Table
    bordered
    loading={loading}
    columns={columns}
    dataSource={data}
    rowKey={columns => columns._id}
    showSorterTooltip={false}
    pagination={
      total <= pageSize
        ? false
        : {
            current: page,
            total,
            defaultPageSize: pageSize,
            showSizeChanger: false,
            showTitle: false,
            position: ['bottomCenter'],
            onChange: (page: number) => setPage(page)
          }
    }
  />
);

export default MyTable;
