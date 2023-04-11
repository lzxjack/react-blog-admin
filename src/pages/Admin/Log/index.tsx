import { useResetState, useTitle } from 'ahooks';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import CustomModal from '@/components/CustomModal';
import Emoji from '@/components/Emoji';
import MyTable from '@/components/MyTable';
import PageHeader from '@/components/PageHeader';
import { logPageSize, siteTitle } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';
import { usePage } from '@/utils/hooks/usePage';
import { useTableData } from '@/utils/hooks/useTableData';

import { Title } from '../titleConfig';
import { useColumns } from './config';
import s from './index.scss';

const Log: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Log}`);

  const { page, setPage } = usePage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [id, setId, resetId] = useResetState('');
  const [date, setDate, resetDate] = useResetState('');
  const [logContent, setLogContent, resetLogContent] = useResetState<string[]>([]);

  const dataFilter = [
    {
      text: '时间',
      data: date,
      setData: setDate,
      reSet: resetDate,
      require: true
    },
    {
      text: '日志',
      data: logContent,
      setData: setLogContent,
      reSet: resetLogContent,
      require: true
    }
  ];

  const openModal = () => {
    setDate(dayjs().format('YYYY-MM-DD'));
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
    DBName: DB.Log,
    dataFilter,
    page,
    setPage,
    modalCancel,
    pageSize: logPageSize
  });

  const handleEdit = (id: string) => {
    setIsModalOpen(true);
    setIsEdit(true);
    setId(id);
    for (const item of data) {
      const { _id, date, logContent } = item;
      if (id === _id) {
        setDate(dayjs(date).format('YYYY-MM-DD'));
        setLogContent(logContent);
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
    const data = { date: new Date(date).getTime(), logContent };
    modalOk({
      isEdit,
      id,
      data,
      page
    });
  };

  const render = () => (
    <>
      <div className={s.contentItem}>
        <div className={s.contentkey}>时间：</div>
        <input
          className={s.contentValue}
          type='text'
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>
      <div className={classNames(s.contentItem, s.textAreaBox)}>
        <div className={s.contentkey}>日志：</div>
        <textarea
          className={classNames(s.contentValue, s.textArea)}
          placeholder='请输入日志，回车分隔'
          value={logContent.join(`\n`)}
          onChange={e => setLogContent(e.target.value.split(`\n`))}
        />
      </div>
      <Emoji style={{ marginLeft: '64px' }} />
    </>
  );

  return (
    <>
      <PageHeader text='添加日志' onClick={openModal} />
      <MyTable
        loading={loading}
        columns={columns}
        data={data}
        total={total}
        page={page}
        pageSize={logPageSize}
        setPage={setPage}
      />
      <CustomModal
        isEdit={isEdit}
        isModalOpen={isModalOpen}
        DBType={DB.Log}
        modalOk={handleModalOk}
        modalCancel={modalCancel}
        render={render}
        updateText='修改'
      />
    </>
  );
};

export default Log;
