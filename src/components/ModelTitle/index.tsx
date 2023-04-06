import React from 'react';

import { DB } from '@/utils/apis/dbConfig';
import { dataMap } from '@/utils/dataMap';

import s from './index.scss';

interface Props {
  isEdit: boolean;
  type: DB;
  addText?: string;
  updateText?: string;
}

const ModelTitle: React.FC<Props> = ({
  isEdit,
  type,
  addText = '添加',
  updateText = '更新'
}) => {
  return (
    <>
      <div className={s.modelTitleCustom}>{isEdit ? updateText : addText}</div>
      {dataMap[type as keyof typeof dataMap]}
    </>
  );
};

export default ModelTitle;
