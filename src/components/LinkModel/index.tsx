import { Modal } from 'antd';
import React from 'react';

import { DB } from '@/utils/apis/dbConfig';

import ModelTitle from '../ModelTitle';
import s from './index.scss';

interface Props {
  isEdit: boolean;
  isModalOpen: boolean;
  modelOk: () => void;
  modelCancel: () => void;
  name: string;
  setName: Function;
  link: string;
  setLink: Function;
  avatar: string;
  setAvatar: Function;
  descr: string;
  setDescr: Function;
}

const LinkModel: React.FC<Props> = ({
  isEdit,
  isModalOpen,
  modelOk,
  modelCancel,
  name,
  setName,
  link,
  setLink,
  avatar,
  setAvatar,
  descr,
  setDescr
}) => {
  return (
    <Modal
      title={<ModelTitle isEdit={isEdit} type={DB.Link} />}
      open={isModalOpen}
      onOk={modelOk}
      onCancel={modelCancel}
    >
      <div className={s.linkInputBox}>
        <div className={s.modalInputBox}>
          <div className={s.modalInputKey}>name：</div>
          <input
            className={s.modalInputValue}
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className={s.modalInputBox}>
          <div className={s.modalInputKey}>link：</div>
          <input
            className={s.modalInputValue}
            type='text'
            value={link}
            onChange={e => setLink(e.target.value)}
          />
        </div>
        <div className={s.modalInputBox}>
          <div className={s.modalInputKey}>avatar：</div>
          <input
            className={s.modalInputValue}
            type='text'
            value={avatar}
            onChange={e => setAvatar(e.target.value)}
          />
        </div>
        <div className={s.modalInputBox}>
          <div className={s.modalInputKey}>descr：</div>
          <input
            className={s.modalInputValue}
            type='text'
            value={descr}
            onChange={e => setDescr(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default LinkModel;
