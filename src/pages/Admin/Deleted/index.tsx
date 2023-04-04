import { useTitle } from 'ahooks';
import React from 'react';

import { siteTitle } from '@/utils/constant';

import { Title } from '../titleConfig';
import s from './index.scss';

const Deleted: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Deleted}`);
  return <>Deleted</>;
};

export default Deleted;
