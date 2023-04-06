import { Popconfirm } from 'antd';
import React from 'react';

import MyButton from '@/components/MyButton';

interface Props {
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
}

export const useColumns = ({ handleEdit, handleDelete }: Props) => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: '_id'
  },
  {
    title: 'Link',
    dataIndex: 'link',
    key: '_id',
    render: (text: string) => (
      <a href={text} target='_blank' rel='noreferrer'>
        {text}
      </a>
    )
  },
  {
    title: 'Avatar',
    dataIndex: 'avatar',
    key: '_id'
  },
  {
    title: 'Descr',
    dataIndex: 'descr',
    key: '_id'
  },
  {
    title: '操作',
    key: '_id',
    render: (record: { _id: string }) => (
      <>
        <MyButton
          style={{ marginRight: '10px' }}
          text='更新'
          small
          onClick={() => handleEdit(record._id)}
        />
        <Popconfirm
          placement='bottomRight'
          title='确定要删除该友链吗？'
          onConfirm={() => handleDelete(record._id)}
          okText='Yes'
          cancelText='No'
        >
          <MyButton text='删除' small danger />
        </Popconfirm>
      </>
    )
  }
];
