import { useTitle } from 'ahooks';
import React from 'react';

import { siteTitle } from '@/utils/constant';

import { Title } from '../titleConfig';
import s from './index.scss';

const Draft: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Drafts}`);
  return <>Draft</>;
};

export default Draft;
