import { useTitle } from 'ahooks';
import { message } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';

import LinkModel from '@/components/LinkModel';
import MyTable from '@/components/MyTable';
import PageHeader from '@/components/PageHeader';
import { addData } from '@/utils/apis/addData';
import { updateData } from '@/utils/apis/updateData';
import { isAdmin } from '@/utils/cloudBase';
import { defaultPageSize, failText, siteTitle, visitorText } from '@/utils/constant';
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
  } = useTableData({ DBName: DB.Link, page });

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

  const clearData = () => {
    setId('');
    setName('');
    setLink('');
    setAvatar('');
    setDescr('');
  };

  const closeModel = () => {
    setIsModalOpen(false);
    clearData();
    setIsEdit(false);
  };

  const addLink = () => {
    addData(DB.Link, {
      name,
      link,
      avatar,
      descr,
      // date: new Date().getTime()
      date: 1680709143000
    }).then(res => {
      if (!res.success && !res.permission) {
        message.warning(visitorText);
      } else if (res.success && res.permission) {
        message.success('添加成功！');
        closeModel();
        flushSync(() => myClearCache(1, getTotalPage(total, defaultPageSize)));
        flushSync(() => setPage(1));
        flushSync(() => {
          dataRun();
          totalRun();
        });
      } else {
        message.warning(failText);
      }
    });
  };

  const editLink = () => {
    updateData(DB.Link, id, {
      name,
      link,
      avatar,
      descr
    }).then(res => {
      if (!res.success && !res.permission) {
        message.warning(visitorText);
      } else if (res.success && res.permission) {
        message.success('修改成功！');
        closeModel();
        flushSync(() => myClearCacheOnePage(page));
        flushSync(() => dataRun());
      } else {
        message.warning(failText);
      }
    });
  };

  const modelOk = () => {
    if (!name || !link || !avatar || !descr) {
      message.info('请输入完整友链信息！');
      return;
    }
    if (!isAdmin()) {
      message.warning(visitorText);
      return;
    }
    isEdit ? editLink() : addLink();
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
      <LinkModel
        isEdit={isEdit}
        isModalOpen={isModalOpen}
        modelOk={modelOk}
        modelCancel={closeModel}
        name={name}
        setName={setName}
        link={link}
        setLink={setLink}
        avatar={avatar}
        setAvatar={setAvatar}
        descr={descr}
        setDescr={setDescr}
      />
    </>
  );
};

export default Link;
