import { useTitle } from 'ahooks';
import React from 'react';

import MyTable from '@/components/MyTable';
import PageHeader from '@/components/PageHeader';
import { siteTitle } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';
import { usePage } from '@/utils/hooks/usePage';
import { useTableData } from '@/utils/hooks/useTableData';

import { Title } from '../titleConfig';
import { useColumns } from './config';
import s from './index.scss';

const Article: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Articles}`);

  const { page, setPage } = usePage();

  const { data, total, loading, handleDelete, modalOk } = useTableData({
    DBName: DB.Article,
    page,
    setPage
  });

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

  return (
    <>
      <PageHeader text='写文章' onClick={() => {}} />
      <MyTable
        loading={loading}
        columns={columns}
        data={data}
        total={total}
        page={page}
        setPage={setPage}
      />
    </>
  );
};

export default Article;
