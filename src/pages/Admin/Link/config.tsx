import { Popconfirm } from 'antd';
import React from 'react';

import MyButton from '@/components/MyButton';

interface Props {
  editLink: (id: string) => void;
  deleteLink: (id: string) => void;
}

export const useColumns = ({ editLink, deleteLink }: Props) => [
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
          text='修改'
          small
          onClick={() => editLink(record._id)}
        />
        <Popconfirm
          placement='bottomRight'
          title='确定要删除该友链吗？'
          onConfirm={() => deleteLink(record._id)}
          okText='Yes'
          cancelText='No'
        >
          <MyButton text='删除' small danger />
        </Popconfirm>
      </>
    )
  }
];

// export {};
