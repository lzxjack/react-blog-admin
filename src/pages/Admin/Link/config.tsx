import { Button, Popconfirm } from '@arco-design/web-react';
import React from 'react';

import { DeleteProps } from '@/utils/hooks/useTableData';

interface Props {
  handleEdit: (id: string) => void;
  handleDelete: (id: string, props: DeleteProps) => void;
  deleteProps: DeleteProps;
}

export const useColumns = ({ handleEdit, handleDelete, deleteProps }: Props) => [
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '链接',
    dataIndex: 'link',
    render: (text: string) => (
      <a href={text} target='_blank' rel='noreferrer'>
        {text}
      </a>
    )
  },
  {
    title: '头像',
    dataIndex: 'avatar'
  },
  {
    title: '描述',
    dataIndex: 'descr'
  },
  {
    title: '操作',
    render: (_: any, { _id }: { _id: string }) => (
      <>
        <Button
          type='primary'
          style={{ marginRight: 10 }}
          onClick={() => handleEdit(_id)}
        >
          更新
        </Button>
        <Popconfirm
          position='br'
          title='确定要删除该友链吗？'
          onOk={() => handleDelete(_id, deleteProps)}
          okText='Yes'
          cancelText='No'
        >
          <Button type='primary' status='danger'>
            删除
          </Button>
        </Popconfirm>
      </>
    )
  }
];
