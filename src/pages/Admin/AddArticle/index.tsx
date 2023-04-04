import { useTitle } from 'ahooks';
import React from 'react';

import { siteTitle } from '@/utils/constant';

import { Title } from '../titleConfig';
import s from './index.scss';

const AddArticle: React.FC = () => {
  // TODO: 添加 or 编辑
  useTitle(`${siteTitle} | 添加文章`);

  return <>AddArticle</>;
};

export default AddArticle;
