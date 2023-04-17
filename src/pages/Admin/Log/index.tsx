import { Input } from '@arco-design/web-react';
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

const { TextArea } = Input;

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
      <Input
        size='large'
        addBefore='时间'
        style={{ marginBottom: 10 }}
        value={date}
        onChange={value => setDate(value)}
      />
      <TextArea
        style={{ resize: 'none', marginBottom: 10, height: 120 }}
        placeholder='请输入日志内容，回车分隔'
        value={logContent.join(`\n`)}
        onChange={value => setLogContent(value.split(`\n`))}
      />
      <Emoji />
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
