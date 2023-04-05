import { useRequest } from 'ahooks';

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

  const { data, loading: dataLoading } = useRequest(
    () =>
      getPageData({
        dbName: dataMap[index as keyof typeof dataMap].DBName,
        page,
        size
      }),
    {
      retryCount: 3,
      refreshDeps: [page],
      cacheKey: `${DB.Link}-data-${page}`,
      staleTime
    }
  );

  const { data: sum, loading: sumLoading } = useRequest(
    () => getSum(dataMap[index as keyof typeof dataMap].DBName),
    {
      retryCount: 3,
      refreshDeps: [page],
      cacheKey: `${dataMap[index as keyof typeof dataMap].DBName}-count`,
      staleTime
    }
  );

  return {
    data: data?.data,
    sum: sum?.total,
    loading: dataLoading && sumLoading
  };
};
