import { useResetState, useTitle } from 'ahooks';
import React, { useState } from 'react';

import CustomModal from '@/components/CustomModal';
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

  const [id, setId, resetId] = useResetState('');
  const [order, setOrder, resetOrder] = useResetState('');
  const [name, setName, resetName] = useResetState('');
  const [descr, setDescr, resetDescr] = useResetState('');
  const [cover, setCover, resetCover] = useResetState('');
  const [link, setLink, resetLink] = useResetState('');

  const dataFilter = [
    {
      text: '序号',
      data: order,
      setData: setOrder,
      reSet: resetOrder,
      require: true
    },
    {
      text: '名称',
      data: name,
      setData: setName,
      reSet: resetName,
      require: true
    },
    {
      text: '描述',
      data: descr,
      setData: setDescr,
      reSet: resetDescr,
      require: true
    },
    {
      text: '封面',
      data: cover,
      setData: setCover,
      reSet: resetCover,
      require: true
    },
    {
      text: '链接',
      data: link,
      setData: setLink,
      reSet: resetLink,
      require: true
    }
  ];

  const clearData = () => {
    for (const { reSet } of dataFilter) {
      reSet();
    }
    resetId();
  };

  const modalCancel = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    clearData();
  };

  const { data, total, loading, handleDelete, modalOk } = useTableData({
    DBName: DB.Show,
    dataFilter,
    page,
    setPage,
    modalCancel,
    sortKey: 'order',
    isAsc: true,
    pageSize: showPageSize
  });

  const handleEdit = (id: string) => {
    setIsModalOpen(true);
    setIsEdit(true);
    setId(id);
    for (const item of data) {
      const { _id, cover, descr, link, name, order } = item;
      if (id === _id) {
        setCover(cover);
        setDescr(descr);
        setLink(link);
        setName(name);
        setOrder(order);
        break;
      }
    }
  };

  const columns = useColumns({
    handleEdit,
    handleDelete,
    deleteProps: {
      page,
      setPage
    }
  });

  const handleModalOk = () => {
    const data = { order: Number(order), name, descr, cover, link };
    modalOk({
      isEdit,
      id,
      data,
      page,
      isClearAll: true
    });
  };

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
      <CustomModal
        isEdit={isEdit}
        isModalOpen={isModalOpen}
        DBType={DB.Show}
        modalOk={handleModalOk}
        modalCancel={modalCancel}
        dataFilter={dataFilter}
      />
    </>
  );
};

export default Show;
