import React, { MouseEventHandler } from 'react';

import MyButton from '@/components/MyButton';

import s from './index.scss';

interface Props {
  text: string;
  onClick: MouseEventHandler<HTMLDivElement>;
}

const PageHeader: React.FC<Props> = ({ text, onClick }) => {
  return (
    <div className={s.pageHeaderBox}>
      <MyButton text={text} onClick={onClick} />
    </div>
  );
};

export default PageHeader;
