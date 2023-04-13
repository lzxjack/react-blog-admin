import React from 'react';

import s from './index.scss';

const ClassCard: React.FC = () => {
  return (
    <div className={s.cardBox}>
      <div className={s.title}>分类</div>
    </div>
  );
};

export default ClassCard;
