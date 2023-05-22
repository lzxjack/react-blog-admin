import { useTitle } from 'ahooks';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import MyTable from '@/components/MyTable';
import { _ } from '@/utils/cloudBase';
import { defaultPageSize, siteTitle } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';
import { usePage } from '@/utils/hooks/usePage';
import { useTableData } from '@/utils/hooks/useTableData';
import { useUpdateData } from '@/utils/hooks/useUpdateData';

import { Title } from '../titleConfig';
import { useColumns } from './config';

const Draft: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Drafts}`);
  const navigate = useNavigate();

  const { page, setPage } = usePage();

  const { data, total, loading, handleDelete, dataRun, totalRun } = useTableData({
    type: DB.Draft,
    DBName: DB.Article,
    page,
    setPage,
    where: { post: _.eq(false) }
  });

  useUpdateData(() => {
    dataRun();
    totalRun();
  });

  const handleEdit = (id: string) => {
    navigate(`/admin/addArticle?id=${id}&from=draft`);
  };

  const columns = useColumns({
    handleEdit,
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
      noHeader={true}
    />
  );
};

export default Draft;
