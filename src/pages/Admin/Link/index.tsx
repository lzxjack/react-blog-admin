import { useRequest, useSafeState, useTitle } from 'ahooks';
import React from 'react';

import PageHeader from '@/components/PageHeader';
import { DB } from '@/utils/apis/dbConfig';
import { getPageData } from '@/utils/apis/getPageData';
import { siteTitle, size, staleTime } from '@/utils/constant';

import { Title } from '../titleConfig';
import s from './index.scss';

const Link: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Link}`);
  const [page, setPage] = useSafeState(1);

  const { data, loading } = useRequest(
    () =>
      getPageData({
        dbName: DB.Link,
        page,
        size
      }),
    {
      retryCount: 3,
      refreshDeps: [page],
      cacheKey: `${DB.Link}-${page}`,
      staleTime
    }
  );

  console.log(data);

  return (
    <>
      <PageHeader
        text='添加友链'
        onClick={() => {
          console.log(123);
        }}
      />
    </>
  );
};

export default Link;
