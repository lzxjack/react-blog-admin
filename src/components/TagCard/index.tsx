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
import { failText, staleTime, visitorText } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';

import CustomModal from '../CustomModal';
import { useColor } from './config';
import s from './index.scss';

const { Search } = Input;

const TagCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId, resetId] = useResetState('');
  const [tag, setTag, resetTag] = useResetState('');
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

  // const updateTagFrom = async (DBName: DB, oldTag: string, newTag: string) => {
  //   const map = {
  //     [DB.Article]: articleTotal?.total || 0,
  //     [DB.Draft]: draftTotal?.total || 0
  //   };
  //   await updateWhereDataAPI(
  //     DBName,
  //     {
  //       tags: _.all([oldTag]),
  //   },
  //     { classes: newClassText }
  //   ).then(res => {
  //     if (!res.success && !res.permission) {
  //       message.warning(visitorText);
  //     } else if (res.success && res.permission) {
  //       message.success(`更新${dataMap[DBName as keyof typeof dataMap]}分类成功！`);
  //       myClearCache({
  //         DBName,
  //         page: 1,
  //         totalPage: getTotalPage(map[DBName as keyof typeof map], defaultPageSize),
  //         deleteTotal: false
  //       });
  //     } else {
  //       message.warning(failText);
  //     }
  //   });
  // };

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
        break;
      }
    }
  };

  const modalCancel = () => {
    setIsModalOpen(false);
    resetId();
    resetTag();
  };

  const { tagColor, colorLen } = useColor();

  const modalOk = () => {
    if (!tag) {
      message.warning('请输入标签名称~');
      return;
    }
    if (isExist(tag, data?.data || [], 'tag')) {
      message.warning('标签名称已存在~');
      return;
    }
    if (!isAdmin()) {
      message.warning(visitorText);
      return;
    }
    updateDataAPI(DB.Tag, id, { tag }).then(res => {
      if (!res.success && !res.permission) {
        message.warning(visitorText);
      } else if (res.success && res.permission) {
        message.success('修改成功！');
        modalCancel();
        flushSync(() => clearCache(`${DB.Tag}-data`));
        flushSync(() => run());
        // TODO:修改关联的文章信息
      } else {
        message.warning(failText);
      }
    });
  };

  const addNewTag = () => {
    if (!newTag) {
      message.warning('请输入标签名称~');
      return;
    }
    if (isExist(newTag, data?.data || [], 'tag')) {
      message.warning('标签名称已存在~');
      return;
    }
    if (!isAdmin()) {
      message.warning(visitorText);
      return;
    }
    addDataAPI(DB.Tag, { tag: newTag, date: Date.now() }).then(res => {
      if (!res.success && !res.permission) {
        message.warning(visitorText);
      } else if (res.success && res.permission) {
        message.success('添加成功！');
        resetNewTag();
        flushSync(() => clearCache(`${DB.Tag}-data`));
        flushSync(() => run());
      } else {
        message.warning(failText);
      }
    });
  };

  const deleteTag = (id: string) => {
    if (!isAdmin()) {
      message.warning(visitorText);
      return;
    }
    deleteDataAPI(DB.Tag, id).then(res => {
      if (!res.success && !res.permission) {
        message.warning(visitorText);
      } else if (res.success && res.permission) {
        message.success('删除成功！');
        flushSync(() => clearCache(`${DB.Tag}-data`));
        flushSync(() => run());
        // TODO:修改关联的文章信息
      } else {
        message.warning(failText);
      }
    });
  };

  return (
    <>
      <div className={s.cardBox}>
        <div className={s.title}>标签</div>
        <Search
          placeholder='新建标签'
          allowClear
          enterButton='创建'
          size='middle'
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          onSearch={addNewTag}
        />
        <div className={classNames(s.tagsBox, { [s.tagLoading]: loading })}>
          {loading ? (
            <LoadingOutlined />
          ) : (
            (data?.data || []).map(
              ({ _id, tag }: { _id: string; tag: string }, index: number) => (
                <div
                  key={_id}
                  className={s.tagItem}
                  style={{ backgroundColor: tagColor[index % colorLen] }}
                >
                  {tag}
                  <EditOutlined className={s.iconBtn} onClick={() => openModal(_id)} />
                  <Popconfirm
                    placement='bottomRight'
                    title={`确定要删除「${tag}」吗？`}
                    onConfirm={() => deleteTag(_id)}
                    okText='Yes'
                    cancelText='No'
                  >
                    <DeleteOutlined className={s.iconBtn} />
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
          <Input size='middle' value={tag} onChange={e => setTag(e.target.value)} />
        )}
      />
    </>
  );
};

export default TagCard;
