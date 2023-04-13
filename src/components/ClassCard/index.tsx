import { DeleteOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { clearCache, useRequest, useResetState } from 'ahooks';
import { Input, message, Popconfirm } from 'antd';
import classNames from 'classnames';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';

import { addDataAPI } from '@/utils/apis/addData';
import { deleteDataAPI } from '@/utils/apis/deleteData';
import { getDataAPI } from '@/utils/apis/getData';
import { updateDataAPI } from '@/utils/apis/updateData';
import { isAdmin } from '@/utils/cloudBase';
import { failText, staleTime, visitorText } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';

import CustomModal from '../CustomModal';
import MyButton from '../MyButton';
import s from './index.scss';

const { Search } = Input;

const ClassCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId, resetId] = useResetState('');
  const [classText, setClassText, resetClassText] = useResetState('');
  const [newClassText, setNewClassText, resetNewClassText] = useResetState('');

  const { data, loading, run } = useRequest(() => getDataAPI(DB.Class), {
    retryCount: 3,
    cacheKey: `${DB.Class}-data`,
    staleTime
  });

  const openModal = (id: string) => {
    setIsModalOpen(true);
    setId(id);
    for (const { _id, class: classText } of data?.data || []) {
      if (id === _id) {
        setClassText(classText);
        break;
      }
    }
  };

  const modalOk = () => {
    if (!classText) {
      message.warning('请输入分类名称~');
      return;
    }
    if (!isAdmin()) {
      message.warning(visitorText);
      return;
    }
    updateDataAPI(DB.Class, id, { class: classText }).then(res => {
      if (!res.success && !res.permission) {
        message.warning(visitorText);
      } else if (res.success && res.permission) {
        message.success('修改成功！');
        modalCancel();
        flushSync(() => clearCache(`${DB.Class}-data`));
        flushSync(() => run());
        // TODO:修改关联的文章信息
      } else {
        message.warning(failText);
      }
    });
  };
  const modalCancel = () => {
    setIsModalOpen(false);
    resetId();
    resetClassText();
  };

  const addNewClass = () => {
    if (!newClassText) {
      message.warning('请输入分类名称~');
      return;
    }
    if (!isAdmin()) {
      message.warning(visitorText);
      return;
    }
    addDataAPI(DB.Class, { class: newClassText, count: 0 }).then(res => {
      if (!res.success && !res.permission) {
        message.warning(visitorText);
      } else if (res.success && res.permission) {
        message.success('添加成功！');
        modalCancel();
        flushSync(() => clearCache(`${DB.Class}-data`));
        flushSync(() => run());
      } else {
        message.warning(failText);
      }
    });
  };

  const deleteClass = (id: string) => {
    if (!isAdmin()) {
      message.warning(visitorText);
      return;
    }
    deleteDataAPI(DB.Class, id).then(res => {
      if (!res.success && !res.permission) {
        message.warning(visitorText);
      } else if (res.success && res.permission) {
        message.success('删除成功！');
        flushSync(() => clearCache(`${DB.Class}-data`));
        flushSync(() => run());
        // TODO:修改关联的文章信息
      } else {
        message.warning(failText);
      }
    });
  };

  console.log(data?.data);

  return (
    <>
      <div className={s.cardBox}>
        <div className={s.title}>分类</div>
        <Search
          placeholder='新建标签'
          allowClear
          enterButton='创建'
          size='middle'
          value={newClassText}
          onChange={e => setNewClassText(e.target.value)}
          onSearch={addNewClass}
        />
        <div className={classNames(s.classesBox, { [s.classLoading]: loading })}>
          {data?.data.map(
            ({
              _id,
              class: classText,
              count
            }: {
              _id: string;
              class: string;
              count: number;
            }) => (
              <div key={_id} className={s.classItem}>
                <div className={s.count}>{count}</div>
                <div className={s.classTextBox}>
                  <div className={s.classText}>《{classText}》</div>
                </div>
                <MyButton
                  onClick={() => openModal(_id)}
                  content={<EditOutlined />}
                  className={s.classBtn}
                />
                <Popconfirm
                  placement='bottomRight'
                  title={`确定要删除《${classText}》吗？`}
                  onConfirm={() => deleteClass(_id)}
                  okText='Yes'
                  cancelText='No'
                >
                  <MyButton content={<DeleteOutlined />} danger className={s.classBtn} />
                </Popconfirm>
              </div>
            )
          ) || <LoadingOutlined />}
        </div>
      </div>
      <CustomModal
        isEdit={true}
        isModalOpen={isModalOpen}
        DBType={DB.Class}
        modalOk={modalOk}
        modalCancel={modalCancel}
        render={() => (
          <Input
            size='middle'
            value={classText}
            onChange={e => setClassText(e.target.value)}
          />
        )}
      />
    </>
  );
};

export default ClassCard;
