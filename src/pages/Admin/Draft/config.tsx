import { Popconfirm, Tag } from 'antd';
import dayjs from 'dayjs';
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
    title: '标题',
    dataIndex: 'title',
    key: '_id',
    render: (title: string) => <strong>{title}</strong>
  },
  {
    title: '保存日期',
    dataIndex: 'date',
    key: '_id',
    render: (timeLine: string) => <>{dayjs(timeLine).format('YYYY-MM-DD HH:mm:ss')}</>
  },
  {
    title: '分类',
    dataIndex: 'classes',
    key: '_id',
    render: (classText: string) => <Tag color='#2db7f5'>{classText}</Tag>
  },
  {
    title: '标签',
    dataIndex: 'tags',
    key: '_id',
    render: (tags: string[]) => (
      <>
        {tags.map((tag, index) => {
          const color = tag.length > 5 ? 'geekblue' : 'green';
          return (
            <Tag color={color} key={index}>
              {tag}
            </Tag>
          );
        })}
      </>
    )
  },
  {
    title: '操作',
    key: '_id',
    render: ({ _id, url }: { _id: string; url: string }) => (
      <>
        <MyButton
          style={{ marginRight: '10px' }}
          content='编辑'
          small
          onClick={() => handleEdit(_id)}
        />
        <Popconfirm
          placement='bottomRight'
          title='确定要删除该文章吗？'
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
