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
import { useColor } from './config';
import s from './index.scss';

const { Search } = Input;

const TagCard: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState('');
  const [oldTag, setOldTag] = useState('');
  const [tag, setTag] = useState('');
  const [newTag, setNewTag, resetNewTag] = useResetState('');

  const { data, loading, run } = useRequest(() => getDataAPI(DB.Tag), {
    retryCount: 3,
    cacheKey: `${DB.Tag}-data`,
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

  const updateTagFrom = ({
    DBName,
    oldTag,
    newTag
  }: {
    DBName: DB;
    oldTag: string;
    newTag: string;
  }) => {
    const map = {
      [DB.Article]: articleTotal?.total || 0,
      [DB.Draft]: draftTotal?.total || 0
    };

    // 1. 添加新标签
    updateWhereDataAPI(
      DBName,
      { tags: _.all([oldTag]) },
      { tags: _.addToSet(newTag) }
    ).then(res => {
      if (!res.success && !res.permission) {
        Message.warning(visitorText);
      } else if (res.success && res.permission) {
        // 2. 删除旧标签
        updateWhereDataAPI(
          DBName,
          { tags: _.all([oldTag]) },
          { tags: _.pull(oldTag) }
        ).then(res => {
          if (!res.success && !res.permission) {
            Message.warning(visitorText);
          } else if (res.success && res.permission) {
            Message.success(`更新${dataMap[DBName as keyof typeof dataMap]}分类成功！`);
            myClearCache({
              DBName,
              page: 1,
              totalPage: getTotalPage(map[DBName as keyof typeof map], defaultPageSize),
              deleteTotal: false
            });
          } else {
            Message.warning(failText);
          }
        });
      } else {
        Message.warning(failText);
      }
    });
  };

  const deleteTagFrom = (DBName: DB, tagWillDeletd: string) => {
    const map = {
      [DB.Article]: articleTotal?.total || 0,
      [DB.Draft]: draftTotal?.total || 0
    };
    updateWhereDataAPI(
      DBName,
      { tags: _.all([tagWillDeletd]) },
      { tags: _.pull(tagWillDeletd) }
    ).then(res => {
      if (!res.success && !res.permission) {
        Message.warning(visitorText);
      } else if (res.success && res.permission) {
        Message.success(`更新${dataMap[DBName as keyof typeof dataMap]}分类成功！`);
        myClearCache({
          DBName,
          page: 1,
          totalPage: getTotalPage(map[DBName as keyof typeof map], defaultPageSize),
          deleteTotal: false
        });
      } else {
        Message.warning(failText);
      }
    });
  };

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
    for (const { _id, tag } of data?.data || []) {
      if (id === _id) {
        setTag(tag);
        setOldTag(tag);
        break;
      }
    }
  };

  const modalCancel = () => {
    setIsModalOpen(false);
  };

  const { tagColor, colorLen } = useColor();

  const modalOk = () => {
    if (!tag) {
      Message.warning('请输入标签名称~');
      return;
    }
    if (isExist(tag, data?.data || [], 'tag')) {
      Message.warning('标签名称已存在~');
      return;
    }
    if (!isAdmin()) {
      Message.warning(visitorText);
      return;
    }
    updateDataAPI(DB.Tag, id, { tag }).then(res => {
      if (!res.success && !res.permission) {
        Message.warning(visitorText);
      } else if (res.success && res.permission) {
        Message.success('修改成功！');
        modalCancel();
        flushSync(() => clearCache(`${DB.Tag}-data`));
        flushSync(() => run());
        updateTagFrom({
          DBName: DB.Article,
          oldTag,
          newTag: tag
        });
        updateTagFrom({
          DBName: DB.Draft,
          oldTag,
          newTag: tag
        });
      } else {
        Message.warning(failText);
      }
    });
  };

  const addNewTag = () => {
    if (!newTag) {
      Message.warning('请输入标签名称~');
      return;
    }
    if (isExist(newTag, data?.data || [], 'tag')) {
      Message.warning('标签名称已存在~');
      return;
    }
    if (!isAdmin()) {
      Message.warning(visitorText);
      return;
    }
    addDataAPI(DB.Tag, { tag: newTag, date: Date.now() }).then(res => {
      if (!res.success && !res.permission) {
        Message.warning(visitorText);
      } else if (res.success && res.permission) {
        Message.success('添加成功！');
        resetNewTag();
        flushSync(() => clearCache(`${DB.Tag}-data`));
        flushSync(() => run());
      } else {
        Message.warning(failText);
      }
    });
  };

  const deleteTag = (id: string, tagWillDeletd: string) => {
    if (!isAdmin()) {
      Message.warning(visitorText);
      return;
    }
    deleteDataAPI(DB.Tag, id).then(res => {
      if (!res.success && !res.permission) {
        Message.warning(visitorText);
      } else if (res.success && res.permission) {
        Message.success('删除成功！');
        flushSync(() => clearCache(`${DB.Tag}-data`));
        flushSync(() => run());
        deleteTagFrom(DB.Article, tagWillDeletd);
        deleteTagFrom(DB.Draft, tagWillDeletd);
      } else {
        Message.warning(failText);
      }
    });
  };

  const toArticle = (tag: string) => {
    navigate(`/admin/article?searchTag=${encodeURIComponent(tag)}&auto=1`);
  };

  return (
    <>
      <div className={s.cardBox}>
        <div className={s.title}>标签</div>
        <Search
          size='default'
          allowClear
          placeholder='新建标签'
          searchButton='创建'
          value={newTag}
          onChange={(value: string) => setNewTag(value)}
          onSearch={addNewTag}
        />
        <div className={classNames(s.tagsBox, { [s.tagLoading]: loading })}>
          {loading ? (
            <IconLoading />
          ) : (
            data?.data.map(
              ({ _id, tag }: { _id: string; tag: string }, index: number) => (
                <div
                  key={_id}
                  className={s.tagItem}
                  style={{ backgroundColor: tagColor[index % colorLen] }}
                  onDoubleClick={() => toArticle(tag)}
                >
                  {tag}
                  <IconEdit className={s.iconBtn} onClick={() => openModal(_id)} />
                  <Popconfirm
                    position='br'
                    title={`确定要删除「${tag}」吗？`}
                    onOk={() => deleteTag(_id, tag)}
                    okText='Yes'
                    cancelText='No'
                  >
                    <IconDelete className={s.iconBtn} />
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
        DBType={DB.Tag}
        modalOk={modalOk}
        modalCancel={modalCancel}
        render={() => (
          <Input size='default' value={tag} onChange={value => setTag(value)} />
        )}
      />
    </>
  );
};

export default TagCard;
