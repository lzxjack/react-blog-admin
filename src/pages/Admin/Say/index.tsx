import { useTitle } from 'ahooks';
import React from 'react';

import { siteTitle } from '@/utils/constant';

import { Title } from '../titleConfig';
import s from './index.scss';

const Say: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Say}`);
  return <>Say</>;
};

export default Say;
