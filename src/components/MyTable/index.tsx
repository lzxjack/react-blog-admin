import { Table, TableColumnProps } from '@arco-design/web-react';
import React from 'react';

import { defaultPageSize } from '@/utils/constant';

import s from './index.scss';

interface Props {
  loading: boolean;
  columns: TableColumnProps[];
  data: any[];
  total: number;
  page: number;
  pageSize?: number;
  setPage: (page: number) => void;
}

const MyTable: React.FC<Props> = ({
  loading,
  columns,
  data,
  total,
  page,
  pageSize = defaultPageSize,
  setPage
}) => (
  <Table
    border
    borderCell
    loading={loading}
    columns={columns}
    data={data}
    rowKey={columns => columns._id}
    showSorterTooltip={false}
    pagePosition='bottomCenter'
    className={s.myTable}
    pagination={
      total <= pageSize
        ? false
        : {
            current: page,
            total,
            defaultPageSize: pageSize,
            sizeCanChange: false,
            onChange: (page: number) => setPage(page),
            hideOnSinglePage: true,
            showTotal: true
          }
    }
  />
);

export default MyTable;
