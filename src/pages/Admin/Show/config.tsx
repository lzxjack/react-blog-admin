import { Popconfirm } from 'antd';
import React from 'react';

import MyButton from '@/components/MyButton';
import { DeleteProps } from '@/utils/hooks/useTableData';

import s from './index.scss';

interface Props {
  handleEdit: (id: string) => void;
  handleDelete: (id: string, props: DeleteProps) => void;
  deleteProps: DeleteProps;
}

export const useColumns = ({ handleEdit, handleDelete, deleteProps }: Props) => [
  {
    title: '封面',
    dataIndex: 'cover',
    key: '_id',
    render: (url: string) => (
      <div className={s.tableCoverBox}>
        <img src={url} alt='cover' className={s.tableCover} />
      </div>
    )
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: '_id'
  },
  {
    title: '描述',
    dataIndex: 'descr',
    key: '_id'
  },
  {
    title: '操作',
    key: '_id',
    render: ({ _id, link }: { _id: string; link: string }) => (
      <>
        <MyButton
          style={{ marginRight: 10 }}
          content='查看'
          small
          onClick={() => window.open(link)}
        />
        <MyButton
          style={{ marginRight: 10 }}
          content='更新'
          small
          onClick={() => handleEdit(_id)}
        />
        <Popconfirm
          placement='bottomRight'
          title='确定要删除该作品吗？'
          onConfirm={() => handleDelete(_id, deleteProps)}
          okText='Yes'
          cancelText='No'
        >
          <MyButton content='删除' small danger />
        </Popconfirm>
      </>
    )
  }
];
