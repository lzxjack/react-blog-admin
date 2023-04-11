import { useTitle } from 'ahooks';
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
  const [id, setId] = useState('');

  const [order, setOrder] = useState('');
  const [name, setName] = useState('');
  const [descr, setDescr] = useState('');
  const [cover, setCover] = useState('');
  const [link, setLink] = useState('');

  const dataFilter = [
    {
      text: '序号',
      data: order,
      setData: setOrder
    },
    {
      text: '名称',
      data: name,
      setData: setName
    },
    {
      text: '描述',
      data: descr,
      setData: setDescr
    },

    {
      text: '封面',
      data: cover,
      setData: setCover
    },
    {
      text: '链接',
      data: link,
      setData: setLink
    }
  ];

  const clearData = () => {
    for (const { setData } of dataFilter) {
      setData('');
    }
  };

  const modalCancel = () => {
    setIsModalOpen(false);
    clearData();
    setIsEdit(false);
  };

  const { data, total, loading, handleDelete, modalOk } = useTableData({
    DBName: DB.Show,
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
      total,
      setPage
    }
  });

  const handleModalOk = () =>
    modalOk({
      dataFilter,
      isEdit,
      config: { id, data: { order, name, descr, cover, link }, total, page }
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
