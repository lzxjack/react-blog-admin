import { Pagination, Table, TableColumnProps } from '@arco-design/web-react';
import classNames from 'classnames';
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
  noHeader?: boolean;
  setPage: (page: number) => void;
}

const MyTable: React.FC<Props> = ({
  loading,
  columns,
  data,
  total,
  page,
  pageSize = defaultPageSize,
  noHeader = false,
  setPage
}) => (
  <>
    <div className={classNames(s.myTableBox, { [s.noHeader]: noHeader })}>
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
        pagination={false}
      />
    </div>
    <div className={s.paginationBox}>
      <Pagination
        size='large'
        current={page}
        total={total}
        pageSize={pageSize}
        sizeCanChange={false}
        onChange={(page: number) => setPage(page)}
        hideOnSinglePage={true}
        showTotal={true}
      />
    </div>
  </>
);

export default MyTable;
