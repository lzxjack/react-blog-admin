import { Popconfirm, Popover } from 'antd';
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
    title: '发布日期',
    dataIndex: 'date',
    key: '_id',
    render: (timeLine: string) => <>{dayjs(timeLine).format('YYYY-MM-DD HH:mm:ss')}</>
  },
  {
    title: '说说内容',
    dataIndex: 'content',
    key: '_id',
    render: (content: string, { imgs }: { imgs?: string[] }) => {
      return (
        <Popover
          placement='bottom'
          content='123123'
          trigger='hover'
          open={!!imgs?.length}
        >
          <div style={{ width: '100%', height: '100%' }}>
            <div
              style={{
                margin: 'auto',
                width: '500px',
                fontSize: '16px'
              }}
            >
              {content}
            </div>
          </div>
        </Popover>
      );
    }
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
          title='确定要删除该说说吗？'
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
