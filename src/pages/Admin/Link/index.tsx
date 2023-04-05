import { useTitle } from 'ahooks';
import { message, Table } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';

import LinkModel from '@/components/LinkModel';
import PageHeader from '@/components/PageHeader';
import { addData } from '@/utils/apis/addData';
import { DB } from '@/utils/apis/dbConfig';
import { deleteData } from '@/utils/apis/deleteData';
import { auth } from '@/utils/cloudBase';
import { adminUid, failText, pageSize, siteTitle, visitorText } from '@/utils/constant';
import { useMyRequest } from '@/utils/myRequest';

import { Title } from '../titleConfig';
import { useColumns } from './config';

const Link: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Link}`);
  const [page, setPage] = useState(1);
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
    myClearCache
  } = useMyRequest({ index: 'link', page, size: pageSize });

  const getAfterDeletedPage = (total: number, nowPage: number, pageSize: number) => {
    if (total === 1) return 1;
    if (total % pageSize === 1 && nowPage === Math.ceil(total / pageSize)) {
      return nowPage - 1;
    }
    return nowPage;
  };

  const handleEdit = (id: string) => {
    // TODO:
    if (auth.currentUser?.uid !== adminUid) {
      message.warning(visitorText);
      return;
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
        flushSync(() => myClearCache());
        flushSync(() => setPage(getAfterDeletedPage(total, page, pageSize)));
        dataRun();
        sumRun();
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
      // date: new Date().getTime()
      date: 1680709136000
    }).then(res => {
      if (!res.success && !res.permission) {
        message.warning(visitorText);
      } else if (res.success && res.permission) {
        message.success('添加成功！');
        closeModel();
        flushSync(() => myClearCache());
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

  const editLink = () => {};

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
      <Table
        bordered
        loading={loading}
        columns={columns}
        dataSource={data}
        rowKey={columns => columns._id}
        showSorterTooltip={false}
        pagination={{
          current: page,
          total,
          defaultPageSize: pageSize,
          showSizeChanger: false,
          showTitle: false,
          position: ['bottomCenter'],
          onChange: (page: number) => setPage(page)
        }}
      />
      <LinkModel
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
