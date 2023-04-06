import { useTitle } from 'ahooks';
import React from 'react';

import CountCard from '@/components/CountCard';
import { DB } from '@/utils/apis/dbConfig';
import { siteTitle } from '@/utils/constant';

import s from './index.scss';

const Home: React.FC = () => {
  useTitle(siteTitle);
  const countCards = [DB.Article, DB.Draft, DB.Link, DB.Msg, DB.Say];

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
