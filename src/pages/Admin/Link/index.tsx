import { useTitle } from 'ahooks';
import { message, Table } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';

import LinkModel from '@/components/LinkModel';
import PageHeader from '@/components/PageHeader';
import { addData } from '@/utils/apis/addData';
import { DB } from '@/utils/apis/dbConfig';
import { deleteData } from '@/utils/apis/deleteData';
import { getTableData } from '@/utils/apis/getTableData';
import { updateData } from '@/utils/apis/updateData';
import { auth } from '@/utils/cloudBase';
import { adminUid, failText, pageSize, siteTitle, visitorText } from '@/utils/constant';

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
    myClearCache,
    myClearCacheOnePage
  } = getTableData({ DBName: DB.Link, page, size: pageSize });

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
      <Table
        bordered
        loading={loading}
        columns={columns}
        dataSource={data}
        rowKey={columns => columns._id}
        showSorterTooltip={false}
        pagination={
          total <= pageSize
            ? false
            : {
                current: page,
                total,
                defaultPageSize: pageSize,
                showSizeChanger: false,
                showTitle: false,
                position: ['bottomCenter'],
                onChange: (page: number) => setPage(page)
              }
        }
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
