import { IconLoading } from '@arco-design/web-react/icon';
import { useRequest } from 'ahooks';
import classNames from 'classnames';
import React from 'react';

import { getTotalAPI } from '@/utils/apis/getTotal';
import { dataMap } from '@/utils/dataMap';
import { DB } from '@/utils/dbConfig';

import s from './index.scss';

interface Props {
  DBName: DB;
  className?: string;
  where?: object;
}

const CountCard: React.FC<Props> = ({ DBName, className, where = {} }) => {
  const { data, loading } = useRequest(() => getTotalAPI({ dbName: DBName, where }), {
    retryCount: 3
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
