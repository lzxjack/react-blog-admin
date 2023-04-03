import React from 'react';

import { blogUrl, githubUrl } from '@/utils/constant';

import s from './index.scss';

const Footer: React.FC = () => {
  return (
    <div className={s.footerBox}>
      <div>
        博客后台管理系统 ©2021 Created by
        <a href={blogUrl} target='_blank' rel='noreferrer'>
          飞鸟
        </a>
      </div>
      <div>
        源代码
        <a href={githubUrl} target='_blank' rel='noreferrer'>
          「GitHub」
        </a>
      </div>
    </div>
  );
};

export default Footer;
