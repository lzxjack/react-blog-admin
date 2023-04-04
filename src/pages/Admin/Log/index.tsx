import { useTitle } from 'ahooks';
import React from 'react';

import { siteTitle } from '@/utils/constant';

import { Title } from '../titleConfig';
import s from './index.scss';

const Log: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Log}`);
  return <>Log</>;
};

export default Log;
