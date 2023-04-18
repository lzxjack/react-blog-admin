import { Input, Message, Popconfirm } from '@arco-design/web-react';
import { IconDelete, IconEdit, IconLoading } from '@arco-design/web-react/icon';
import { clearCache, useRequest, useResetState } from 'ahooks';
import classNames from 'classnames';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';

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
import s from './index.scss';

const { Search } = Input;

const ClassCard: React.FC = () => {
  const navigate = useNavigate();
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

  const { data: articleTotal } = useRequest(
    () => getTotalAPI({ dbName: DB.Article, where: { post: _.eq(true) } }),
    {
      retryCount: 3,
      cacheKey: `${DB.Article}-${JSON.stringify({ post: _.eq(true) })}-total`,
      staleTime
    }
  );

  const { data: draftTotal } = useRequest(
    () => getTotalAPI({ dbName: DB.Article, where: { post: _.eq(false) } }),
    {
      retryCount: 3,
      cacheKey: `${DB.Article}-${JSON.stringify({ post: _.eq(false) })}-total`,
      staleTime
    }
  );

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
      Message.warning('请输入分类名称~');
      return;
    }
    if (isExist(classText, data?.data || [], 'class')) {
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
        flushSync(() => clearCache(`${DB.Class}-data`));
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
    if (isExist(newClassText, data?.data || [], 'class')) {
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
          flushSync(() => clearCache(`${DB.Class}-data`));
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
        myClearCache({
          key: `${DB.Article}-${JSON.stringify({ post: _.eq(true) })}`,
          page: 1,
          totalPage: getTotalPage(articleTotal?.total || 0, defaultPageSize),
          deleteTotal: false
        });
        myClearCache({
          key: `${DB.Article}-${JSON.stringify({ post: _.eq(false) })}`,
          page: 1,
          totalPage: getTotalPage(draftTotal?.total || 0, defaultPageSize),
          deleteTotal: false
        });
        Message.success(`更新数据库分类成功！`);
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
        flushSync(() => clearCache(`${DB.Class}-data`));
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
            data?.data.map(
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
                  <div className={s.classBtn} onClick={() => openModal(_id)}>
                    <IconEdit />
                  </div>
                  <Popconfirm
                    position='br'
                    title={`确定要删除《${classText}》吗？`}
                    onOk={() => deleteClass(_id, classText)}
                    okText='Yes'
                    cancelText='No'
                  >
                    <div className={classNames(s.classBtn, s.classBtnDanger)}>
                      <IconDelete />
                    </div>
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
