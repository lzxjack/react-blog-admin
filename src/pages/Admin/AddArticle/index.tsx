import { Input } from '@arco-design/web-react';
import { useTitle } from 'ahooks';
import React from 'react';

import { siteTitle } from '@/utils/constant';

import { Title } from '../titleConfig';
import s from './index.scss';

const AddArticle: React.FC = () => {
  // TODO: 添加 or 编辑
  useTitle(`${siteTitle} | ${Title.AddArticle}`);

  return (
    <>
      <div className={s.addArticleHeader}>
        <div className={s.top}>
          <Input
            // style={{ width: 350 }}
            addBefore='http://'
            allowClear
            placeholder='Please enter'
          />
        </div>
        <div className={s.bottom}>123</div>
      </div>
    </>
  );
};

export default AddArticle;
