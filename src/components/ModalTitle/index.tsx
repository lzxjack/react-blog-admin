import React from 'react';

import { dataMap } from '@/utils/dataMap';
import { DB } from '@/utils/dbConfig';

import s from './index.scss';

interface Props {
  isEdit: boolean;
  type: DB;
  addText: string;
  updateText: string;
}

const ModalTitle: React.FC<Props> = ({ isEdit, type, addText, updateText }) => {
  return (
    <div className={s.ModalTitleBox}>
      <div className={s.ModalTitleCustom}>{isEdit ? updateText : addText}</div>
      {dataMap[type as keyof typeof dataMap]}
    </div>
  );
};

export default ModalTitle;
