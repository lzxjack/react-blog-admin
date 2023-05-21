import { useRequest, useTitle } from 'ahooks';
import React from 'react';

import AboutBase from '@/components/AboutBase';
import { getDataAPI } from '@/utils/apis/getData';
import { siteTitle } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';
import { useUpdateData } from '@/utils/hooks/useUpdateData';

import { Title } from '../titleConfig';
import s from './index.scss';

const About: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.About}`);

  const { data, run } = useRequest(() => getDataAPI(DB.About), {
    retryCount: 3
  });

  useUpdateData(run);

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
