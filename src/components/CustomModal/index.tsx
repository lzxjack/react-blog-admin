import { Modal } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';

import { DB } from '@/utils/dbConfig';
import { DataFilterProps } from '@/utils/hooks/useTableData';

import ModalTitle from '../ModalTitle';
import s from './index.scss';

interface Props {
  isEdit: boolean;
  isModalOpen: boolean;
  DBType: DB;
  modalOk: () => void;
  modalCancel: () => void;
  dataFilter?: DataFilterProps[];
  addText?: string;
  updateText?: string;
  render?: () => React.ReactNode;
}

const LinkModal: React.FC<Props> = ({
  isEdit,
  isModalOpen,
  DBType,
  modalOk,
  modalCancel,
  dataFilter = [],
  addText = '添加',
  updateText = '更新',
  render
}) => {
  const dataFilterRes = () =>
    dataFilter.map(({ text, data, setData }) => (
      <div className={s.inputBox} key={text}>
        <div className={s.inputKey}>{text}：</div>
        <input
          className={s.inputValue}
          type='text'
          value={data}
          onChange={e => setData(e.target.value)}
        />
      </div>
    ));

  return (
    <Modal
      title={
        <ModalTitle
          isEdit={isEdit}
          type={DBType}
          addText={addText}
          updateText={updateText}
        />
      }
      open={isModalOpen}
      onOk={modalOk}
      onCancel={modalCancel}
    >
      <div className={s.modalBox}>{render?.() || dataFilterRes()}</div>
    </Modal>
  );
};

export default LinkModal;
