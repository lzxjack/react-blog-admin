import { useTitle } from 'ahooks';
import { message } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';

import CustomModal from '@/components/CustomModal';
import MyTable from '@/components/MyTable';
import PageHeader from '@/components/PageHeader';
import { addDataAPI } from '@/utils/apis/addData';
import { updateDataAPI } from '@/utils/apis/updateData';
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

  const modalCancel = () => {
    setIsModalOpen(false);
    clearData();
    setIsEdit(false);
  };

  const addLink = () => {
    addDataAPI(DB.Link, {
      name,
      link,
      avatar,
      descr,
      date: new Date().getTime()
    }).then(res => {
      if (!res.success && !res.permission) {
        message.warning(visitorText);
      } else if (res.success && res.permission) {
        message.success('添加成功！');
        modalCancel();
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
    updateDataAPI(DB.Link, id, {
      name,
      link,
      avatar,
      descr
    }).then(res => {
      if (!res.success && !res.permission) {
        message.warning(visitorText);
      } else if (res.success && res.permission) {
        message.success('修改成功！');
        modalCancel();
        flushSync(() => myClearCacheOnePage(page));
        flushSync(() => dataRun());
      } else {
        message.warning(failText);
      }
    });
  };

  const modalOk = () => {
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
      <CustomModal
        isEdit={isEdit}
        isModalOpen={isModalOpen}
        DBType={DB.Link}
        modalOk={modalOk}
        modalCancel={modalCancel}
        dataFilter={dataFilter}
      />
    </>
  );
};

export default Link;
