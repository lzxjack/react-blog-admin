import { useTitle } from 'ahooks';
import React from 'react';

import CountCard from '@/components/CountCard';
import { siteTitle } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';

import s from './index.scss';

const Home: React.FC = () => {
  useTitle(siteTitle);
  const countCards = [DB.Article, DB.Say, DB.Msg, DB.Link, DB.Log];

  return (
    <>
      {/* 统计卡片区 */}
      <div className={s.countCardContainer}>
        {countCards.map(item => (
          <CountCard key={item} DBName={item} />
        ))}
      </div>
    </>
  );
};

export default Home;
