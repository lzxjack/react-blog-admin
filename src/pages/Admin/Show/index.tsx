import { useTitle } from 'ahooks';
import React, { useState } from 'react';

import MyTable from '@/components/MyTable';
import PageHeader from '@/components/PageHeader';
import { showPageSize, siteTitle } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';
import { usePage } from '@/utils/hooks/usePage';
import { useTableData } from '@/utils/hooks/useTableData';

import { Title } from '../titleConfig';
import { useColumns } from './config';

const Show: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Show}`);
  const { page, setPage } = usePage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState('');

  const [order, setOrder] = useState('');
  const [name, setName] = useState('');
  const [descr, setDescr] = useState('');
  const [cover, setCover] = useState('');
  const [link, setLink] = useState('');

  const {
    data,
    total,
    loading,
    dataRun,
    totalRun,
    myClearCacheOnePage,
    myClearCache,
    getTotalPage,
    handleDelete
  } = useTableData({
    DBName: DB.Show,
    page,
    sortKey: 'order',
    isAsc: true,
    pageSize: showPageSize
  });

  const handleEdit = (id: string) => {};

  const handleOpenShow = (url: string) => {
    window.open(url);
  };

  const columns = useColumns({
    handleEdit,
    handleOpenShow,
    handleDelete,
    deleteProps: {
      page,
      total,
      setPage
    }
  });

  return (
    <>
      <PageHeader text='添加作品' onClick={() => setIsModalOpen(true)} />
      <MyTable
        loading={loading}
        columns={columns}
        data={data}
        total={total}
        page={page}
        pageSize={showPageSize}
        setPage={setPage}
      />
    </>
  );
};

export default Show;
