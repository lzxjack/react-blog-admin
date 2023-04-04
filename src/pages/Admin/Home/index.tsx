import { useTitle } from 'ahooks';
import React from 'react';

import CountCard from '@/components/CountCard';
import { siteTitle } from '@/utils/constant';

import { useCountCarts } from './config';
import s from './index.scss';

const Home: React.FC = () => {
  useTitle(siteTitle);
  const countCarts = useCountCarts();

  return (
    <>
      {/* 统计卡片区 */}
      <div className={s.countCardContainer}>
        {countCarts.map(({ title, DBName }) => (
          <CountCard key={title} title={title} DBName={DBName} />
        ))}
      </div>
    </>
  );
};

export default Home;
