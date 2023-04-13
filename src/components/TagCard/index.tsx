import React from 'react';

import s from './index.scss';

const TagCard: React.FC = () => {
  return (
    <div className={s.cardBox}>
      <div className={s.title}>标签</div>
    </div>
  );
};

export default TagCard;
