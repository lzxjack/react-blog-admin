import { clearCache, useMount, useRequest, useTitle } from 'ahooks';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

import AboutBase from '@/components/AboutBase';
import { getDataAPI } from '@/utils/apis/getData';
import { siteTitle, staleTime } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';

import { Title } from '../titleConfig';
import s from './index.scss';

const About: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.About}`);

  const [searchParams, setSearchParams] = useSearchParams();

  const { data, run } = useRequest(() => getDataAPI(DB.About), {
    retryCount: 3,
    cacheKey: `${DB.About}-data`,
    staleTime
  });

  const handleDeleteParam = (param: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(param);
    setSearchParams(params.toString());
  };

  useMount(() => {
    const updated = searchParams.get('updated');
    if (updated === '1') {
      clearCache(`${DB.About}-data`);
      run();
      handleDeleteParam('updated');
    }
  });

  return (
    <div className={s.aboutBox}>
      <div className={s.left}>
        <AboutBase content={data?.data[1].content || ''} site='关于我' params={1} />
      </div>
      <div className={s.right}>
        <AboutBase content={data?.data[0].content || ''} site='关于本站' params={0} />
      </div>
    </div>
  );
};

export default About;
