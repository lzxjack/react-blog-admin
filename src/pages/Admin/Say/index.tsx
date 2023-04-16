import { useResetState, useTitle } from 'ahooks';
import { Input } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import CustomModal from '@/components/CustomModal';
import Emoji from '@/components/Emoji';
import MyTable from '@/components/MyTable';
import PageHeader from '@/components/PageHeader';
import { siteTitle } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';
import { usePage } from '@/utils/hooks/usePage';
import { useTableData } from '@/utils/hooks/useTableData';

import sLog from '../Log/index.scss';
import { Title } from '../titleConfig';
import { useColumns } from './config';

const { TextArea } = Input;

const Say: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Say}`);

  const { page, setPage } = usePage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [id, setId, resetId] = useResetState('');
  const [date, setDate, resetDate] = useResetState('');
  const [content, setContent, resetContent] = useResetState('');
  const [imgs, setImgs, resetImgs] = useResetState<string[]>([]);

  const dataFilter = [
    {
      text: '时间',
      data: date,
      setData: setDate,
      reSet: resetDate,
      require: true
    },
    {
      text: '内容',
      data: content,
      setData: setContent,
      reSet: resetContent,
      require: true
    },
    {
      text: '图片',
      data: imgs,
      setData: setImgs,
      reSet: resetImgs,
      require: false
    }
  ];

  const openModal = () => {
    setDate(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    setIsModalOpen(true);
  };

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
    DBName: DB.Say,
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
      const { _id, date, content, imgs = [] } = item;
      if (id === _id) {
        setDate(dayjs(date).format('YYYY-MM-DD HH:mm:ss'));
        setContent(content);
        setImgs(imgs);
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
    const data = {
      date: new Date(date).getTime(),
      content,
      imgs: imgs.filter(img => img)
    };
    modalOk({
      isEdit,
      id,
      data,
      page
    });
  };

  const render = () => (
    <>
      <div className={sLog.contentItem}>
        <div className={sLog.contentkey}>时间：</div>
        <Input
          value={date}
          style={{ fontSize: 16 }}
          onChange={e => setDate(e.target.value)}
        />
      </div>
      <div className={classNames(sLog.contentItem, sLog.textAreaBox)}>
        <div className={sLog.contentkey}>内容：</div>
        <TextArea
          style={{ resize: 'none', fontSize: 16 }}
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </div>
      <div
        className={classNames(sLog.contentItem, sLog.textAreaBox)}
        style={{ height: 112 }}
      >
        <div className={sLog.contentkey}>图片：</div>
        <TextArea
          style={{ resize: 'none', fontSize: 16 }}
          placeholder='（可选）插入图片url，回车分隔，最多4张'
          value={imgs.join(`\n`)}
          onChange={e => {
            const imgs = e.target.value.split(`\n`);
            if (imgs.length <= 4) {
              setImgs(imgs);
            }
          }}
        />
      </div>
      <Emoji style={{ marginLeft: 64 }} />
    </>
  );

  return (
    <>
      <PageHeader text='发表说说' onClick={openModal} />
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
        DBType={DB.Say}
        modalOk={handleModalOk}
        modalCancel={modalCancel}
        render={render}
        addText='发表'
        updateText='修改'
      />
    </>
  );
};

export default Say;
