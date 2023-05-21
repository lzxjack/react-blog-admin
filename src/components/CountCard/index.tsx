import { IconLoading } from '@arco-design/web-react/icon';
import { useMount, useRequest } from 'ahooks';
import classNames from 'classnames';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { baseType, stateType } from '@/redux/selectors';
import { getTotalAPI } from '@/utils/apis/getTotal';
import { dataMap } from '@/utils/dataMap';
import { DB } from '@/utils/dbConfig';

import s from './index.scss';

interface Props {
  DBName: DB;
  className?: string;
  where?: object;
  selector: (state: stateType) => baseType;
  reducer: any;
}

const CountCard: React.FC<Props> = ({
  DBName,
  className,
  where = {},
  selector,
  reducer
}) => {
  const dispatch = useDispatch();
  const reduxData = useSelector(selector);

  const { loading, run } = useRequest(() => getTotalAPI({ dbName: DBName, where }), {
    retryCount: 3,
    manual: true,
    onSuccess: res => {
      dispatch(reducer(res.total));
    }
  });

  useMount(() => {
    if (reduxData?.count?.isDone === false) {
      run();
    }
  });

  return (
    <div className={classNames(s.countCardBox, className)}>
      <div className={s.key}>{dataMap[DBName as keyof typeof dataMap]}数</div>
      <div className={classNames(s.value, { [s.loading]: loading })}>
        {loading ? <IconLoading /> : reduxData?.count?.value}
      </div>
    </div>
  );
};

export default CountCard;
