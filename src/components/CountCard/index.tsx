import { IconLoading } from '@arco-design/web-react/icon';
import { useRequest } from 'ahooks';
import classNames from 'classnames';
import React from 'react';

import { getTotalAPI } from '@/utils/apis/getTotal';
import { staleTime } from '@/utils/constant';
import { dataMap } from '@/utils/dataMap';
import { DB } from '@/utils/dbConfig';

import s from './index.scss';

interface Props {
  DBName: DB;
  className?: string;
}

const CountCard: React.FC<Props> = ({ DBName, className }) => {
  const { data, loading } = useRequest(() => getTotalAPI(DBName), {
    retryCount: 3,
    cacheKey: `${DBName}-total`,
    staleTime
  });

  return (
    <div className={classNames(s.countCardBox, className)}>
      <div className={s.key}>{dataMap[DBName as keyof typeof dataMap]}数</div>
      <div className={classNames(s.value, { [s.loading]: loading })}>
        {loading ? <IconLoading /> : data?.total}
      </div>
    </div>
  );
};

export default CountCard;
