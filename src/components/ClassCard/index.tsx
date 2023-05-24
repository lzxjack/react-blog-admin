import { Button, Input, Message, Popconfirm } from '@arco-design/web-react';
import { IconDelete, IconEdit, IconLoading } from '@arco-design/web-react/icon';
import { useRequest, useResetState } from 'ahooks';
import classNames from 'classnames';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectArticle, selectClass } from '@/redux/selectors';
import { resetArticleData } from '@/redux/slices/articles';
import { setClasses } from '@/redux/slices/classes';
import { resetDraftData } from '@/redux/slices/drafts';
import { addDataAPI } from '@/utils/apis/addData';
import { deleteDataAPI } from '@/utils/apis/deleteData';
import { getDataAPI } from '@/utils/apis/getData';
import { updateDataAPI } from '@/utils/apis/updateData';
import { updateWhereDataAPI } from '@/utils/apis/updateWhereData';
import { _, isAdmin } from '@/utils/cloudBase';
import { failText, visitorText } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';

import CustomModal from '../CustomModal';
import s from './index.scss';

const { Search } = Input;

const ClassCard: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState('');
  const [oldClassText, setOldClassText] = useState('');
  const [classText, setClassText] = useState('');
  const [newClassText, setNewClassText, resetNewClassText] = useResetState('');

  const classes = useSelector(selectClass);
  const articles = useSelector(selectArticle);
  const dispatch = useDispatch();

  const { loading, run } = useRequest(() => getDataAPI(DB.Class), {
    retryCount: 3,
    manual: true,
    onSuccess: res => {
      dispatch(setClasses(res.data));
    }
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
    for (const { _id, class: classText } of classes.value) {
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
      Message.warning('请输入分类名称~');
      return;
    }
    if (isExist(classText, classes.value, 'class')) {
      Message.warning('分类名称已存在~');
      return;
    }
    if (!isAdmin()) {
      Message.warning(visitorText);
      return;
    }
    updateDataAPI(DB.Class, id, { class: classText }).then(res => {
      if (!res.success && !res.permission) {
        Message.warning(visitorText);
      } else if (res.success && res.permission) {
        Message.success('修改成功！');
        modalCancel();
        flushSync(() => run());
        updateClassFromDB(oldClassText, classText);
      } else {
        Message.warning(failText);
      }
    });
  };

  const addNewClass = () => {
    if (!newClassText) {
      Message.warning('请输入分类名称~');
      return;
    }
    if (isExist(newClassText, classes.value, 'class')) {
      Message.warning('分类名称已存在~');
      return;
    }
    if (!isAdmin()) {
      Message.warning(visitorText);
      return;
    }
    addDataAPI(DB.Class, { class: newClassText, count: 0, date: Date.now() }).then(
      res => {
        if (!res.success && !res.permission) {
          Message.warning(visitorText);
        } else if (res.success && res.permission) {
          Message.success('添加成功！');
          resetNewClassText();
          flushSync(() => run());
        } else {
          Message.warning(failText);
        }
      }
    );
  };

  const updateClassFromDB = (oldClassText: string, newClassText: string) => {
    updateWhereDataAPI(
      DB.Article,
      { classes: _.eq(oldClassText) },
      { classes: newClassText }
    ).then(res => {
      if (!res.success && !res.permission) {
        Message.warning(visitorText);
      } else if (res.success && res.permission) {
        Message.success(`更新数据库分类成功！`);
        dispatch(resetArticleData());
        dispatch(resetDraftData());
      } else {
        Message.warning(failText);
      }
    });
  };

  const deleteClass = (id: string, classText: string) => {
    if (!isAdmin()) {
      Message.warning(visitorText);
      return;
    }
    deleteDataAPI(DB.Class, id).then(res => {
      if (!res.success && !res.permission) {
        Message.warning(visitorText);
      } else if (res.success && res.permission) {
        Message.success('删除成功！');
        flushSync(() => run());
        updateClassFromDB(classText, '');
      } else {
        Message.warning(failText);
      }
    });
  };

  const toArticle = (classText: string) => {
    navigate(`/admin/article?searchClass=${encodeURIComponent(classText)}`);
  };

  const noClassId = '000xxx000';
  const getNoClass = () => {
    let sum = 0;
    classes.value.forEach((item: any) => {
      sum += item.count;
    });

    return {
      _id: noClassId,
      class: '未分类',
      count: `${articles.count.value - sum}`
    };
  };

  return (
    <>
      <div className={s.cardBox}>
        <div className={s.title}>分类</div>
        <Search
          size='default'
          allowClear
          placeholder='新建分类'
          searchButton='创建'
          value={newClassText}
          onChange={(value: string) => setNewClassText(value)}
          onSearch={addNewClass}
        />
        <div className={classNames(s.classesBox, { [s.classLoading]: loading })}>
          {loading ? (
            <IconLoading />
          ) : (
            [...classes.value, getNoClass()].map(
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
                    <div className={s.classText} onClick={() => toArticle(classText)}>
                      《{classText}》
                    </div>
                  </div>
                  <Button
                    type='primary'
                    className={s.classBtn}
                    icon={<IconEdit />}
                    onClick={() => openModal(_id)}
                    disabled={_id === noClassId}
                  />
                  <Popconfirm
                    position='br'
                    title={`确定要删除《${classText}》吗？`}
                    onOk={() => deleteClass(_id, classText)}
                    okText='Yes'
                    cancelText='No'
                    disabled={_id === noClassId}
                  >
                    <Button
                      type='primary'
                      status='danger'
                      className={s.classBtn}
                      icon={<IconDelete />}
                      disabled={_id === noClassId}
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
            size='default'
            value={classText}
            onChange={value => setClassText(value)}
          />
        )}
      />
    </>
  );
};

export default ClassCard;
