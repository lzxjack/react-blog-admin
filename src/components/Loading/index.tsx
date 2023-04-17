import { IconLoading } from '@arco-design/web-react/icon';
import React from 'react';

import s from './index.scss';

const Loading: React.FC = () => {
  return (
    <div className={s.loadingBox}>
      <IconLoading />
    </div>
  );
};

export default Loading;
