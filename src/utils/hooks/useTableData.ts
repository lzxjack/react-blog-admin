import { Message } from '@arco-design/web-react';
import { useMount, useRequest } from 'ahooks';
import { useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import { resetClasses } from '@/redux/slices/classes';
import { getTotalAPI } from '@/utils/apis/getTotal';
import { getWhereOrderPageDataAPI } from '@/utils/apis/getWhereOrderPageData';
import { defaultPageSize, failText, visitorText } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';

import { addDataAPI } from '../apis/addData';
import { deleteDataAPI } from '../apis/deleteData';
import { updateDataAPI } from '../apis/updateData';
import { _, isAdmin } from '../cloudBase';
import { dataMap } from '../dataMap';
import { classCountChange, getAfterDeletedPage } from '../functions';
import { reduxMap } from '../reduxMap';

export interface DataFilterProps {
  text: string;
  data: string | string[];
  setData: any;
  reSet: any;
  require: boolean;
}

interface Props {
  type: DB;
  DBName: DB;
  dataFilter?: DataFilterProps[];
  page: number;
  setPage: (page: number) => void;
  modalCancel?: () => void;
  sortKey?: string;
  isAsc?: boolean;
  pageSize?: number;
  where?: object;
  classesRun?: () => void;
}

export interface DeleteProps {
  page: number;
  setPage: (page: number) => void;
}

// 获取表格数据（data & total）
export const useTableData = ({
  type,
  DBName,
  dataFilter,
  page,
  setPage,
  modalCancel,
  sortKey = 'date',
  isAsc = false,
  pageSize = defaultPageSize,
  where = {},
  classesRun = () => {}
}: Props) => {
  const dispatch = useDispatch();
  const reduxData = useSelector(reduxMap[type as keyof typeof reduxMap].selector);

  const { loading: dataLoading, run: dataRun } = useRequest(
    () =>
      getWhereOrderPageDataAPI({
        dbName: DBName,
        sortKey,
        isAsc,
        page,
        size: pageSize,
        where
      }),
    {
      retryCount: 3,
      manual: true,
      onSuccess: res => {
        dispatch(
          reduxMap[type as keyof typeof reduxMap].dataReducer({ items: res.data, page })
        );
      }
    }
  );

  const { loading: totalLoading, run: totalRun } = useRequest(
    () => getTotalAPI({ dbName: DBName, where }),
    {
      retryCount: 3,
      manual: true,
      onSuccess: res => {
        dispatch(reduxMap[type as keyof typeof reduxMap].countReducer(res.total));
      }
    }
  );

  useMount(() => {
    if (!reduxData.count.isDone) {
      totalRun();
    }
  });

  useEffect(() => {
    if (!new Set(reduxData.data.done).has(page)) {
      dataRun();
    }
  }, [page]);

  const handleDelete = (id: string, { page, setPage }: DeleteProps) => {
    if (!isAdmin()) {
      Message.warning(visitorText);
      return;
    }

    deleteDataAPI(DBName, id).then(res => {
      if (!res.success && !res.permission) {
        Message.warning(visitorText);
      } else if (res.success && res.permission) {
        Message.success('删除成功！');
        if (DBName === DB.Article) {
          const classText = reduxData.data.value[page].filter(
            ({ _id }: { _id: string }) => _id === id
          )[0].classes;
          classCountChange(classText, 'min', () => {
            dispatch(resetClasses());
          });
        }
        flushSync(() => {
          dispatch(reduxMap[type as keyof typeof reduxMap].dataResetReducer());
          setPage(getAfterDeletedPage(reduxData.count.value, page, pageSize));
        });
        flushSync(() => {
          dataRun();
          totalRun();
        });
      } else {
        Message.warning(failText);
      }
    });
  };

  const addData = (data: object) => {
    addDataAPI(DBName, data).then(res => {
      if (!res.success && !res.permission) {
        Message.warning(visitorText);
      } else if (res.success && res.permission) {
        Message.success('添加成功！');
        modalCancel?.();
        flushSync(() => {
          dispatch(reduxMap[type as keyof typeof reduxMap].dataResetReducer());
          setPage(1);
        });
        flushSync(() => {
          dataRun();
          totalRun();
        });
      } else {
        Message.warning(failText);
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
        Message.warning(visitorText);
      } else if (res.success && res.permission) {
        Message.success('修改成功！');
        modalCancel?.();
        flushSync(() => {
          dataRun();
        });
      } else {
        Message.warning(failText);
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
      Message.info(`请输入完整${dataMap[DBName as keyof typeof dataMap]}信息！`);
      return;
    }
    if (!isAdmin()) {
      Message.warning(visitorText);
      return;
    }
    isEdit ? editData({ id, data, page, isClearAll }) : addData(data);
  };

  return {
    data: reduxData.data.value[page],
    total: reduxData.count.value,
    loading: dataLoading || totalLoading,
    handleDelete,
    modalOk,
    dataRun,
    totalRun
  };
};
