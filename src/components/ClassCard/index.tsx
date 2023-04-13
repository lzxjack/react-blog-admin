import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Input } from 'antd';
import React from 'react';

import { getDataAPI } from '@/utils/apis/getData';
import { staleTime } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';

import MyButton from '../MyButton';
import s from './index.scss';

const { Search } = Input;

const ClassCard: React.FC = () => {
  const { data, loading: dataLoading } = useRequest(() => getDataAPI(DB.Class), {
    retryCount: 3,
    cacheKey: `${DB.Class}-data`,
    staleTime
  });

  console.log(data);

  return (
    <div className={s.cardBox}>
      <div className={s.title}>分类</div>
      <Search placeholder='新建标签' allowClear enterButton='创建' size='middle' />
      <div className={s.classesBox}>
        {data?.data.map(
          ({
            _id,
            class: classText,
            count
          }: {
            _id: string;
            class: string;
            count: number;
          }) => (
            <div key={_id} className={s.classItem}>
              <div className={s.count}>{count}</div>
              <div className={s.classText}>《{classText}》</div>
              <MyButton content={<EditOutlined />} className={s.classBtn} />
              <MyButton content={<DeleteOutlined />} danger className={s.classBtn} />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ClassCard;
