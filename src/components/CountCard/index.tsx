import { LoadingOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import classNames from 'classnames';
import React from 'react';
import { useDispatch } from 'react-redux';

import { getSum } from '@/utils/apis/getSum';
import { staleTime } from '@/utils/constant';

import { useCardMap } from './config';
import s from './index.scss';

interface Props {
  index: string;
  className?: string;
}

const CountCard: React.FC<Props> = ({ index, className }) => {
  const dispatch = useDispatch();
  const cardMap = useCardMap();

  const { data, loading } = useRequest(
    () => getSum(cardMap[index as keyof typeof cardMap].DBName),
    {
      retryCount: 3,
      // TODO:
      // refreshDeps: [page],
      cacheKey: `${cardMap[index as keyof typeof cardMap].DBName}-count`,
      staleTime,
      onSuccess: ({ total }) => {
        dispatch(cardMap[index as keyof typeof cardMap].setSum(`${total}`));
      }
    }
  );

  return (
    <div className={classNames(s.countCardBox, className)}>
      <div className={s.key}>{cardMap[index as keyof typeof cardMap].name}数</div>
      <div className={classNames(s.value, { [s.loading]: loading })}>
        {loading ? <LoadingOutlined /> : data?.total}
      </div>
    </div>
  );
};

export default CountCard;
