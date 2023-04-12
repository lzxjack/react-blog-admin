import { Popconfirm } from 'antd';
import React from 'react';

import MyButton from '@/components/MyButton';
import { DeleteProps } from '@/utils/hooks/useTableData';

interface Props {
  handleEdit: (id: string) => void;
  handleDelete: (id: string, props: DeleteProps) => void;
  deleteProps: DeleteProps;
}

export const useColumns = ({ handleEdit, handleDelete, deleteProps }: Props) => [
  {
    title: '名称',
    dataIndex: 'name',
    key: '_id'
  },
  {
    title: '链接',
    dataIndex: 'link',
    key: '_id',
    render: (text: string) => (
      <a href={text} target='_blank' rel='noreferrer'>
        {text}
      </a>
    )
  },
  {
    title: '头像',
    dataIndex: 'avatar',
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
    render: ({ _id }: { _id: string }) => (
      <>
        <MyButton
          style={{ marginRight: '10px' }}
          content='更新'
          small
          onClick={() => handleEdit(_id)}
        />
        <Popconfirm
          placement='bottomRight'
          title='确定要删除该友链吗？'
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
