import { useTitle } from 'ahooks';
import { message } from 'antd';
import React from 'react';
import { flushSync } from 'react-dom';

import MyTable from '@/components/MyTable';
import { deleteData } from '@/utils/apis/deleteData';
import { isAdmin } from '@/utils/cloudBase';
import { blogUrl, failText, pageSize, siteTitle, visitorText } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';
import { usePage } from '@/utils/hooks/usePage';
import { useTableData } from '@/utils/hooks/useTableData';

import { Title } from '../titleConfig';
import { useColumns } from './config';

const Msg: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Msg}`);
  const { page, setPage } = usePage();

  const {
    data,
    sum: total,
    loading,
    dataRun,
    sumRun,
    myClearCache,
    getTotalPage,
    getAfterDeletedPage
  } = useTableData({ DBName: DB.Msg, page, size: pageSize });

  const handleOpenMsg = (postTitle: string) => {
    const url = postTitle ? `${blogUrl}/post?title=${postTitle}` : `${blogUrl}/msg`;
    window.open(url);
  };

  const handleDelete = (id: string) => {
    if (!isAdmin()) {
      message.warning(visitorText);
      return;
    }
    deleteData(DB.Msg, id).then(res => {
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

  const columns = useColumns({ handleOpenMsg, handleDelete });

  return (
    <>
      <MyTable
        loading={loading}
        columns={columns}
        data={data}
        total={total}
        page={page}
        setPage={setPage}
      />
    </>
  );
};

export default Msg;
