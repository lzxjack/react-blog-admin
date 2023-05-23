import { Button, Popconfirm } from '@arco-design/web-react';
import React from 'react';

import { DeleteProps } from '@/utils/hooks/useTableData';

import s from './index.scss';

interface Props {
  handleEdit: (id: string) => void;
  handleDelete: (id: string, props: DeleteProps) => void;
  deleteProps: DeleteProps;
}

export const useColumns = ({ handleEdit, handleDelete, deleteProps }: Props) => [
  {
    title: '序号',
    dataIndex: 'order'
  },
  {
    title: '封面',
    dataIndex: 'cover',
    render: (url: string) => (
      <div className={s.tableCoverBox}>
        <img src={url} alt='cover' className={s.tableCover} />
      </div>
    )
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '描述',
    dataIndex: 'descr'
  },
  {
    title: '操作',
    render: (_: any, { _id, link }: { _id: string; link: string }) => (
      <>
        <Button
          type='primary'
          style={{ marginRight: 10 }}
          onClick={() => window.open(link)}
        >
          查看
        </Button>
        <Button
          style={{ marginRight: 10 }}
          type='primary'
          onClick={() => handleEdit(_id)}
        >
          更新
        </Button>
        <Popconfirm
          position='br'
          title='确定要删除该作品吗？'
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
