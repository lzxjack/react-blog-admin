import { useTitle } from 'ahooks';
import React from 'react';

import Chart from '@/components/Chart';
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
      {/* 扇形图、分类、标签、公告 */}
      <div className={s.homeBigContainer}>
        <div className={s.chartContainer}>
          <Chart />
        </div>
        <div className={s.classesContainer}>2</div>
        <div className={s.tagsNoticeContainer}>
          <div className={s.NoticeContainer}>3</div>
          <div className={s.tagsContainer}>4</div>
        </div>
      </div>
    </>
  );
};

export default Home;
