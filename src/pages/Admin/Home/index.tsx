import { useTitle } from 'ahooks';
import React from 'react';

import CountCard from '@/components/CountCard';
import { siteTitle } from '@/utils/constant';

import s from './index.scss';

const Home: React.FC = () => {
  useTitle(siteTitle);
  const countCards = ['article', 'draft', 'link', 'msg', 'say'];

  return (
    <>
      {/* 统计卡片区 */}
      <div className={s.countCardContainer}>
        {countCards.map(item => (
          <CountCard key={item} index={item} />
        ))}
      </div>
    </>
  );
};

export default Home;
