import { clearCache, useRequest } from 'ahooks';

import { DB } from '@/utils/apis/dbConfig';
import { getPageData } from '@/utils/apis/getPageData';
import { getSum } from '@/utils/apis/getSum';
import { staleTime } from '@/utils/constant';
import { dataMap } from '@/utils/dataMap';

interface Props {
  index: string;
  page: number;
  size: number;
}

export const useMyRequest = (config: Props) => {
  const { index, page, size } = config;

  const {
    data,
    loading: dataLoading,
    run: dataRun
  } = useRequest(
    () =>
      getPageData({
        dbName: dataMap[index as keyof typeof dataMap].DBName,
        isAsc: false,
        page,
        size
      }),
    {
      retryCount: 3,
      refreshDeps: [page],
      cacheKey: `${DB.Link}-data-${page}`,
      staleTime,
      onSuccess: res => {
        console.log(`执行了getData,key为${DB.Link}-data-${page}`);
        console.log(res);
      }
    }
  );

  const {
    data: sum,
    loading: sumLoading,
    run: sumRun
  } = useRequest(() => getSum(dataMap[index as keyof typeof dataMap].DBName), {
    retryCount: 3,
    cacheKey: `${dataMap[index as keyof typeof dataMap].DBName}-count`,
    staleTime,
    onSuccess: () => {
      console.log('执行了getSum');
    }
  });

  const myClearCache = () => {
    clearCache(`${DB.Link}-data-${page}`);
    clearCache(`${dataMap[index as keyof typeof dataMap].DBName}-count`);
    console.log(`删除key为${DB.Link}-data-${page}`);
  };

  return {
    data: data?.data,
    sum: sum?.total,
    loading: dataLoading && sumLoading,
    dataRun,
    sumRun,
    myClearCache
  };
};
