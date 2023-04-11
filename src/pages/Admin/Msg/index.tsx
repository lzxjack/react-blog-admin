import { useTitle } from 'ahooks';
import React from 'react';

import MyTable from '@/components/MyTable';
import { siteTitle } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';
import { usePage } from '@/utils/hooks/usePage';
import { useTableData } from '@/utils/hooks/useTableData';

import { Title } from '../titleConfig';
import { useColumns } from './config';

const Msg: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Msg}`);
  const { page, setPage } = usePage();

  const { data, total, loading, handleDelete } = useTableData({
    DBName: DB.Msg,
    page,
    setPage
  });

  const columns = useColumns({
    handleDelete,
    deleteProps: {
      page,
      setPage
    }
  });

  return (
    <MyTable
      loading={loading}
      columns={columns}
      data={data}
      total={total}
      page={page}
      setPage={setPage}
    />
  );
};

export default Msg;
