import { useTitle } from 'ahooks';
import { message, Table } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';

import LinkModel from '@/components/LinkModel';
import MyTable from '@/components/MyTable';
import PageHeader from '@/components/PageHeader';
import { addData } from '@/utils/apis/addData';
import { deleteData } from '@/utils/apis/deleteData';
import { updateData } from '@/utils/apis/updateData';
import { auth } from '@/utils/cloudBase';
import { adminUid, failText, pageSize, siteTitle, visitorText } from '@/utils/constant';
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
    sum: total,
    loading,
    dataRun,
    sumRun,
    myClearCache,
    myClearCacheOnePage
  } = useTableData({ DBName: DB.Link, page, size: pageSize });

  const getTotalPage = (total: number, pageSize: number) => {
    const totalPage = total / pageSize;
    if (Number.isInteger(totalPage)) {
      return totalPage;
    }
    return Math.ceil(totalPage);
  };

  const getAfterDeletedPage = (total: number, nowPage: number, pageSize: number) => {
    if (total === 1) return 1;
    if (total % pageSize === 1 && nowPage === Math.ceil(total / pageSize)) {
      return nowPage - 1;
    }
    return nowPage;
  };

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

  const handleDelete = (id: string) => {
    if (auth.currentUser?.uid !== adminUid) {
      message.warning(visitorText);
      return;
    }
    deleteData(DB.Link, id).then(res => {
      if (!res.success && !res.permission) {
        message.warning(visitorText);
      } else if (res.success && res.permission) {
        message.success('删除成功！');
        flushSync(() => myClearCache(page, getTotalPage(total, pageSize)));
        flushSync(() => setPage(getAfterDeletedPage(total, page, pageSize)));
        flushSync(() => {
          dataRun();
          sumRun();
        });
      } else {
        message.warning(failText);
      }
    });
  };

  const columns = useColumns({ handleEdit, handleDelete });

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
      date: new Date().getTime()
    }).then(res => {
      if (!res.success && !res.permission) {
        message.warning(visitorText);
      } else if (res.success && res.permission) {
        message.success('添加成功！');
        closeModel();
        flushSync(() => myClearCache(1, getTotalPage(total, pageSize)));
        flushSync(() => setPage(1));
        flushSync(() => {
          dataRun();
          sumRun();
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
    if (auth.currentUser?.uid !== adminUid) {
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
