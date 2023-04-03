import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';

import s from './index.scss';

const Loading: React.FC = () => {
  return (
    <div className={s.loadingBox}>
      <LoadingOutlined />
    </div>
  );
};

export default Loading;
