import { Popconfirm } from 'antd';
import dayjs from 'dayjs';
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
    title: '日期',
    dataIndex: 'date',
    key: '_id',
    render: (timeLine: string) => <>{dayjs(timeLine).format('YYYY-MM-DD')}</>
  },
  {
    title: '事件内容',
    dataIndex: 'logContent',
    key: '_id',
    render: (arr: string[]) => (
      <>
        {arr.map((item, index) => (
          <div key={index} style={{ fontSize: '16px', padding: '5px 0' }}>
            {item}
          </div>
        ))}
      </>
    )
  },
  {
    title: '操作',
    key: '_id',
    render: ({ _id }: { _id: string }) => (
      <>
        <MyButton
          style={{ marginRight: '10px' }}
          text='修改'
          small
          onClick={() => handleEdit(_id)}
        />
        <Popconfirm
          placement='bottomRight'
          title='确定要删除该事件吗？'
          onConfirm={() => handleDelete(_id, deleteProps)}
          okText='Yes'
          cancelText='No'
        >
          <MyButton text='删除' small danger />
        </Popconfirm>
      </>
    )
  }
];
