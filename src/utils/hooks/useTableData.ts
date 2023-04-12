import { clearCache, useRequest } from 'ahooks';
import { message } from 'antd';
import { flushSync } from 'react-dom';

import { getPageDataAPI } from '@/utils/apis/getPageData';
import { getTotalAPI } from '@/utils/apis/getTotal';
import { defaultPageSize, failText, staleTime, visitorText } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';

import { addDataAPI } from '../apis/addData';
import { deleteDataAPI } from '../apis/deleteData';
import { updateDataAPI } from '../apis/updateData';
import { isAdmin } from '../cloudBase';
import { dataMap } from '../dataMap';

export interface DataFilterProps {
  text: string;
  data: string | string[];
  setData: any;
  reSet: any;
  require: boolean;
}

interface Props {
  DBName: DB;
  dataFilter?: DataFilterProps[];
  page: number;
  setPage: (page: number) => void;
  modalCancel?: () => void;
  sortKey?: string;
  isAsc?: boolean;
  pageSize?: number;
}

export interface DeleteProps {
  page: number;
  setPage: (page: number) => void;
}

// 获取表格数据（data & total）
export const useTableData = ({
  DBName,
  dataFilter,
  page,
  setPage,
  modalCancel,
  sortKey = 'date',
  isAsc = false,
  pageSize = defaultPageSize
}: Props) => {
  const {
    data,
    loading: dataLoading,
    run: dataRun
  } = useRequest(
    () =>
      getPageDataAPI({
        dbName: DBName,
        sortKey,
        isAsc,
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
  } = useRequest(() => getTotalAPI(DBName), {
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

  const handleDelete = (id: string, { page, setPage }: DeleteProps) => {
    if (!isAdmin()) {
      message.warning(visitorText);
      return;
    }
    deleteDataAPI(DBName, id).then(res => {
      if (!res.success && !res.permission) {
        message.warning(visitorText);
      } else if (res.success && res.permission) {
        message.success('删除成功！');
        flushSync(() => myClearCache(page, getTotalPage(total.total, pageSize)));
        flushSync(() => setPage(getAfterDeletedPage(total.total, page, pageSize)));
        flushSync(() => {
          dataRun();
          totalRun();
        });
      } else {
        message.warning(failText);
      }
    });
  };

  const addData = (data: object) => {
    addDataAPI(DBName, data).then(res => {
      if (!res.success && !res.permission) {
        message.warning(visitorText);
      } else if (res.success && res.permission) {
        message.success('添加成功！');
        modalCancel?.();
        flushSync(() => myClearCache(1, getTotalPage(total.total, pageSize)));
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

  const editData = ({
    id,
    data,
    page,
    isClearAll
  }: {
    id: string;
    data: object;
    page: number;
    isClearAll: boolean;
  }) => {
    updateDataAPI(DBName, id, data).then(res => {
      if (!res.success && !res.permission) {
        message.warning(visitorText);
      } else if (res.success && res.permission) {
        message.success('修改成功！');
        modalCancel?.();
        flushSync(() => {
          isClearAll
            ? myClearCache(1, getTotalPage(total.total, pageSize))
            : myClearCacheOnePage(page);
        });
        flushSync(() => {
          dataRun();
          totalRun();
        });
      } else {
        message.warning(failText);
      }
    });
  };

  const modalOk = ({
    isEdit,
    id,
    data,
    page,
    isClearAll = false
  }: {
    isEdit: boolean;
    id: string;
    data: object;
    page: number;
    isClearAll?: boolean;
  }) => {
    if (
      dataFilter?.some(
        ({ data: filterData, require }) =>
          require && (!filterData || (Array.isArray(filterData) && !filterData.length))
      )
    ) {
      message.info(`请输入完整${dataMap[DBName as keyof typeof dataMap]}信息！`);
      return;
    }
    if (!isAdmin()) {
      message.warning(visitorText);
      return;
    }
    isEdit ? editData({ id, data, page, isClearAll }) : addData(data);
  };

  return {
    data: data?.data,
    total: total?.total,
    loading: dataLoading || totalLoading,
    handleDelete,
    modalOk
  };
};
