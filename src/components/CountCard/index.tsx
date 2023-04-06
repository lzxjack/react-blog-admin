import { LoadingOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import classNames from 'classnames';
import React from 'react';

import { getSum } from '@/utils/apis/getSum';
import { staleTime } from '@/utils/constant';
import { dataMap } from '@/utils/dataMap';
import { DB } from '@/utils/dbConfig';

import s from './index.scss';

interface Props {
  DBName: DB;
  className?: string;
}

const CountCard: React.FC<Props> = ({ DBName, className }) => {
  const { data, loading } = useRequest(() => getSum(DBName), {
    retryCount: 3,
    cacheKey: `${DBName}-count`,
    staleTime
  });

  return (
    <div className={classNames(s.countCardBox, className)}>
      <div className={s.key}>{dataMap[DBName as keyof typeof dataMap]}数</div>
      <div className={classNames(s.value, { [s.loading]: loading })}>
        {loading ? <LoadingOutlined /> : data?.total}
      </div>
    </div>
  );
};

export default CountCard;
