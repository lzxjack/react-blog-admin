import { Button } from '@arco-design/web-react';
import React, { MouseEventHandler } from 'react';

import s from './index.scss';

interface Props {
  text: string;
  onClick: (e: Event) => void;
  render?: () => React.ReactNode;
}

const PageHeader: React.FC<Props> = ({ text, onClick, render }) => {
  return (
    <div className={s.pageHeaderBox}>
      <Button type='primary' size='large' onClick={onClick}>
        {text}
      </Button>
      {render && <>{render()}</>}
    </div>
  );
};

export default PageHeader;
