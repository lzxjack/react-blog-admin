import { useTitle } from 'ahooks';
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
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [avatar, setAvatar] = useState('');
  const [descr, setDescr] = useState('');

  const dataFilter = [
    {
      text: '名称',
      data: name,
      setData: setName
    },
    {
      text: '链接',
      data: link,
      setData: setLink
    },
    {
      text: '头像',
      data: avatar,
      setData: setAvatar
    },
    {
      text: '描述',
      data: descr,
      setData: setDescr
    }
  ];

  const modalCancel = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    setId('');
  };

  const { data, total, loading, handleDelete, modalOk } = useTableData({
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
      total,
      setPage
    }
  });

  const handleModalOk = () => {
    const data = { name, link, avatar, descr };
    modalOk({
      isEdit,
      id,
      data: isEdit ? data : { ...data, date: new Date().getTime() },
      total,
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
