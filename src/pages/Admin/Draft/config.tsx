import { Button, Popconfirm, Tag } from '@arco-design/web-react';
import dayjs from 'dayjs';
import React from 'react';

import TableTag from '@/components/TableTag';
import { DeleteProps } from '@/utils/hooks/useTableData';

interface Props {
  handleEdit: (id: string) => void;
  handleDelete: (id: string, props: DeleteProps) => void;
  deleteProps: DeleteProps;
}

export const useColumns = ({ handleEdit, handleDelete, deleteProps }: Props) => [
  {
    title: '标题',
    dataIndex: 'title',
    render: (title: string) => <strong>{title}</strong>
  },
  {
    title: '保存日期',
    dataIndex: 'date',
    render: (timeLine: string) => <>{dayjs(timeLine).format('YYYY-MM-DD HH:mm:ss')}</>
  },
  {
    title: '分类',
    dataIndex: 'classes',
    render: (classText: string) => (
      <>{classText ? <Tag color='#2db7f5'>{classText}</Tag> : null}</>
    )
  },
  {
    title: '标签',
    dataIndex: 'tags',
    render: (tags: string[]) => <TableTag tags={tags} />
  },
  {
    title: '操作',
    render: (_: any, { _id }: { _id: string; url: string }) => (
      <>
        <Button
          style={{ marginRight: 10 }}
          type='primary'
          onClick={() => handleEdit(_id)}
        >
          编辑
        </Button>
        <Popconfirm
          position='br'
          title='确定要删除该文章吗？'
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
