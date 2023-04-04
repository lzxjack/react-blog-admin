import { useTitle } from 'ahooks';
import React from 'react';

import { siteTitle } from '@/utils/constant';

import s from './index.scss';

const Home: React.FC = () => {
  useTitle(`${siteTitle}`);

  return <>Home</>;
};

export default Home;
