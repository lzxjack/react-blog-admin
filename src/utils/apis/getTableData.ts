import { clearCache, useRequest } from 'ahooks';

import { DB } from '@/utils/apis/dbConfig';
import { getPageData } from '@/utils/apis/getPageData';
import { getSum } from '@/utils/apis/getSum';
import { staleTime } from '@/utils/constant';

interface Props {
  DBName: DB;
  page: number;
  size: number;
}

// 获取表格数据（data & sum）
export const getTableData = (config: Props) => {
  const { DBName, page, size } = config;

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
        size
      }),
    {
      retryCount: 3,
      refreshDeps: [page],
      cacheKey: `${DBName}-data-${page}`,
      staleTime
    }
  );

  const {
    data: sum,
    loading: sumLoading,
    run: sumRun
  } = useRequest(() => getSum(DBName), {
    retryCount: 3,
    cacheKey: `${DBName}-count`,
    staleTime
  });

  const myClearCache = (page: number, totalPage: number) => {
    for (let i = page; i <= totalPage; i++) {
      clearCache(`${DBName}-data-${i}`);
    }
    clearCache(`${DBName}-count`);
  };

  const myClearCacheOnePage = (page: number) => {
    clearCache(`${DBName}-data-${page}`);
  };

  return {
    data: data?.data,
    sum: sum?.total,
    loading: dataLoading && sumLoading,
    dataRun,
    sumRun,
    myClearCache,
    myClearCacheOnePage
  };
};
