import { LoadingOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import classNames from 'classnames';
import React from 'react';

import { DB } from '@/utils/apis/dbConfig';
import { getSum } from '@/utils/apis/getSum';
import { staleTime } from '@/utils/constant';

import s from './index.scss';

interface Props {
  title: string;
  DBName: DB;
  className?: string;
}

const CountCard: React.FC<Props> = ({ title, DBName, className }) => {
  const { data, loading } = useRequest(() => getSum(DBName), {
    retryCount: 3,
    // TODO:
    // refreshDeps: [page],
    cacheKey: `${DBName}-count`,
    staleTime
  });

  return (
    <div className={classNames(s.countCardBox, className)}>
      <div className={s.key}>{title}数</div>
      <div className={classNames(s.value, { [s.loading]: loading })}>
        {loading ? <LoadingOutlined /> : data?.total}
      </div>
    </div>
  );
};

export default CountCard;
