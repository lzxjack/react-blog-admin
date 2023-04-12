import React, { MouseEventHandler } from 'react';

import MyButton from '@/components/MyButton';

import s from './index.scss';

interface Props {
  text: string;
  onClick: MouseEventHandler<HTMLDivElement>;
  render?: () => React.ReactNode;
}

const PageHeader: React.FC<Props> = ({ text, onClick, render }) => {
  return (
    <div className={s.pageHeaderBox}>
      <MyButton content={text} onClick={onClick} style={{ borderRadius: 8 }} />
      {render && <div className={s.searchBox}>{render()}</div>}
    </div>
  );
};

export default PageHeader;
