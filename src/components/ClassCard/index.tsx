import { DeleteOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { clearCache, useRequest, useResetState } from 'ahooks';
import { Input, message, Popconfirm } from 'antd';
import classNames from 'classnames';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';

import { addDataAPI } from '@/utils/apis/addData';
import { deleteDataAPI } from '@/utils/apis/deleteData';
import { getDataAPI } from '@/utils/apis/getData';
import { getTotalAPI } from '@/utils/apis/getTotal';
import { updateDataAPI } from '@/utils/apis/updateData';
import { updateWhereDataAPI } from '@/utils/apis/updateWhereData';
import { _, isAdmin } from '@/utils/cloudBase';
import { defaultPageSize, failText, staleTime, visitorText } from '@/utils/constant';
import { dataMap } from '@/utils/dataMap';
import { DB } from '@/utils/dbConfig';
import { getTotalPage, myClearCache } from '@/utils/functions';

import CustomModal from '../CustomModal';
import MyButton from '../MyButton';
import s from './index.scss';

const { Search } = Input;

const ClassCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState('');
  const [oldClassText, setOldClassText] = useState('');
  const [classText, setClassText] = useState('');
  const [newClassText, setNewClassText, resetNewClassText] = useResetState('');

  const { data, loading, run } = useRequest(() => getDataAPI(DB.Class), {
    retryCount: 3,
    cacheKey: `${DB.Class}-data`,
    staleTime
  });

  const { data: articleTotal } = useRequest(() => getTotalAPI(DB.Article), {
    retryCount: 3,
    cacheKey: `${DB.Article}-total`,
    staleTime
  });

  const { data: draftTotal } = useRequest(() => getTotalAPI(DB.Draft), {
    retryCount: 3,
    cacheKey: `${DB.Draft}-total`,
    staleTime
  });

  const isExist = (
    content: string,
    data: { class?: string; tag?: string }[],
    type: 'class' | 'tag'
  ) => {
    return data.some(item => item[type as keyof typeof item] === content);
  };

  const openModal = (id: string) => {
    setIsModalOpen(true);
    setId(id);
    for (const { _id, class: classText } of data?.data || []) {
      if (id === _id) {
        setClassText(classText);
        setOldClassText(classText);
        break;
      }
    }
  };

  const modalCancel = () => {
    setIsModalOpen(false);
  };

  const modalOk = () => {
    if (!classText) {
      message.warning('请输入分类名称~');
      return;
    }
    if (isExist(classText, data?.data || [], 'class')) {
      message.warning('分类名称已存在~');
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
        updateClassFrom(DB.Article, oldClassText, classText);
        updateClassFrom(DB.Draft, oldClassText, classText);
      } else {
        message.warning(failText);
      }
    });
  };

  const addNewClass = () => {
    if (!newClassText) {
      message.warning('请输入分类名称~');
      return;
    }
    if (isExist(newClassText, data?.data || [], 'class')) {
      message.warning('分类名称已存在~');
      return;
    }
    if (!isAdmin()) {
      message.warning(visitorText);
      return;
    }
    addDataAPI(DB.Class, { class: newClassText, count: 0, date: Date.now() }).then(
      res => {
        if (!res.success && !res.permission) {
          message.warning(visitorText);
        } else if (res.success && res.permission) {
          message.success('添加成功！');
          resetNewClassText();
          flushSync(() => clearCache(`${DB.Class}-data`));
          flushSync(() => run());
        } else {
          message.warning(failText);
        }
      }
    );
  };

  const updateClassFrom = (DBName: DB, oldClassText: string, newClassText: string) => {
    const map = {
      [DB.Article]: articleTotal?.total || 0,
      [DB.Draft]: draftTotal?.total || 0
    };
    updateWhereDataAPI(
      DBName,
      { classes: _.eq(oldClassText) },
      { classes: newClassText }
    ).then(res => {
      if (!res.success && !res.permission) {
        message.warning(visitorText);
      } else if (res.success && res.permission) {
        message.success(`更新${dataMap[DBName as keyof typeof dataMap]}分类成功！`);
        myClearCache({
          DBName,
          page: 1,
          totalPage: getTotalPage(map[DBName as keyof typeof map], defaultPageSize),
          deleteTotal: false
        });
      } else {
        message.warning(failText);
      }
    });
  };

  const deleteClass = (id: string, classText: string) => {
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
        updateClassFrom(DB.Article, classText, '');
        updateClassFrom(DB.Draft, classText, '');
      } else {
        message.warning(failText);
      }
    });
  };

  return (
    <>
      <div className={s.cardBox}>
        <div className={s.title}>分类</div>
        <Search
          placeholder='新建分类'
          allowClear
          enterButton='创建'
          size='middle'
          value={newClassText}
          onChange={e => setNewClassText(e.target.value)}
          onSearch={addNewClass}
        />
        <div className={classNames(s.classesBox, { [s.classLoading]: loading })}>
          {loading ? (
            <LoadingOutlined />
          ) : (
            (data?.data || []).map(
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
                    onConfirm={() => deleteClass(_id, classText)}
                    okText='Yes'
                    cancelText='No'
                  >
                    <MyButton
                      content={<DeleteOutlined />}
                      danger
                      className={s.classBtn}
                    />
                  </Popconfirm>
                </div>
              )
            )
          )}
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
