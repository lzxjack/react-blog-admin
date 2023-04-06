import { clearCache, useRequest } from 'ahooks';
import { message } from 'antd';
import { flushSync } from 'react-dom';

import { getPageData } from '@/utils/apis/getPageData';
import { getTotal } from '@/utils/apis/getTotal';
import { failText, pageSize, staleTime, visitorText } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';

import { deleteData } from '../apis/deleteData';
import { isAdmin } from '../cloudBase';

interface Props {
  DBName: DB;
  page: number;
}

export interface DeleteProps {
  page: number;
  total: number;
  setPage: (page: number) => void;
}

// 获取表格数据（data & total）
export const useTableData = ({ DBName, page }: Props) => {
  const {
    data,
    loading: dataLoading,
    run: dataRun
  } = useRequest(
    () =>
      getPageData({
        dbName: DBName,
        isAsc: false,
        page,
        size: pageSize
      }),
    {
      retryCount: 3,
      refreshDeps: [page],
      cacheKey: `${DBName}-data-${page}`,
      staleTime
    }
  );

  const {
    data: total,
    loading: totalLoading,
    run: totalRun
  } = useRequest(() => getTotal(DBName), {
    retryCount: 3,
    cacheKey: `${DBName}-total`,
    staleTime
  });

  const myClearCache = (page: number, totalPage: number) => {
    for (let i = page; i <= totalPage; i++) {
      clearCache(`${DBName}-data-${i}`);
    }
    clearCache(`${DBName}-total`);
  };

  const myClearCacheOnePage = (page: number) => {
    clearCache(`${DBName}-data-${page}`);
  };

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

  const handleDelete = (id: string, { page, total, setPage }: DeleteProps) => {
    if (!isAdmin()) {
      message.warning(visitorText);
      return;
    }
    deleteData(DBName, id).then(res => {
      if (!res.success && !res.permission) {
        message.warning(visitorText);
      } else if (res.success && res.permission) {
        message.success('删除成功！');
        flushSync(() => myClearCache(page, getTotalPage(total, pageSize)));
        flushSync(() => setPage(getAfterDeletedPage(total, page, pageSize)));
        flushSync(() => {
          dataRun();
          totalRun();
        });
      } else {
        message.warning(failText);
      }
    });
  };

  return {
    data: data?.data,
    total: total?.total,
    loading: dataLoading && totalLoading,
    dataRun,
    totalRun,
    myClearCache,
    myClearCacheOnePage,
    getTotalPage,
    handleDelete
  };
};
