import { LoadingOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import classNames from 'classnames';
import React from 'react';

import { getSum } from '@/utils/apis/getSum';
import { staleTime } from '@/utils/constant';
import { dataMap } from '@/utils/dataMap';

import s from './index.scss';

interface Props {
  index: string;
  className?: string;
}

const CountCard: React.FC<Props> = ({ index, className }) => {
  const { data, loading } = useRequest(
    () => getSum(dataMap[index as keyof typeof dataMap].DBName),
    {
      retryCount: 3,
      // TODO:
      // refreshDeps: [page],
      cacheKey: `${dataMap[index as keyof typeof dataMap].DBName}-count`,
      staleTime
    }
  );

  return (
    <div className={classNames(s.countCardBox, className)}>
      <div className={s.key}>{dataMap[index as keyof typeof dataMap].name}数</div>
      <div className={classNames(s.value, { [s.loading]: loading })}>
        {loading ? <LoadingOutlined /> : data?.total}
      </div>
    </div>
  );
};

export default CountCard;
