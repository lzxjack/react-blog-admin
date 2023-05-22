import { useResetState, useTitle } from 'ahooks';
import React, { useState } from 'react';

import CustomModal from '@/components/CustomModal';
import MyTable from '@/components/MyTable';
import PageHeader from '@/components/PageHeader';
import { siteTitle } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';
import { usePage } from '@/utils/hooks/usePage';
import { useTableData } from '@/utils/hooks/useTableData';

import { Title } from '../titleConfig';
import { useColumns } from './config';

const Link: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Link}`);

  const { page, setPage } = usePage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [id, setId, resetId] = useResetState('');
  const [name, setName, resetName] = useResetState('');
  const [link, setLink, resetLink] = useResetState('');
  const [avatar, setAvatar, resetAvatar] = useResetState('');
  const [descr, setDescr, resetDescr] = useResetState('');

  const dataFilter = [
    {
      text: '名称',
      data: name,
      setData: setName,
      reSet: resetName,
      require: true
    },
    {
      text: '链接',
      data: link,
      setData: setLink,
      reSet: resetLink,
      require: true
    },
    {
      text: '头像',
      data: avatar,
      setData: setAvatar,
      reSet: resetAvatar,
      require: true
    },
    {
      text: '描述',
      data: descr,
      setData: setDescr,
      reSet: resetDescr,
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
    type: DB.Link,
    DBName: DB.Link,
    dataFilter,
    page,
    setPage,
    modalCancel
  });

  const handleEdit = (id: string) => {
    setIsModalOpen(true);
    setIsEdit(true);
    setId(id);
    for (const item of data) {
      const { _id, avatar, descr, link, name } = item;
      if (id === _id) {
        setAvatar(avatar);
        setDescr(descr);
        setLink(link);
        setName(name);
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
    const data = { name, link, avatar, descr };
    modalOk({
      isEdit,
      id,
      data: isEdit ? data : { ...data, date: Date.now() },
      page
    });
  };

  return (
    <>
      <PageHeader text='添加友链' onClick={() => setIsModalOpen(true)} />
      <MyTable
        loading={loading}
        columns={columns}
        data={data}
        total={total}
        page={page}
        setPage={setPage}
      />
      <CustomModal
        isEdit={isEdit}
        isModalOpen={isModalOpen}
        DBType={DB.Link}
        modalOk={handleModalOk}
        modalCancel={modalCancel}
        dataFilter={dataFilter}
      />
    </>
  );
};

export default Link;
