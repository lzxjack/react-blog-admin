import { Button, Popconfirm } from '@arco-design/web-react';
import dayjs from 'dayjs';
import React from 'react';

import { DeleteProps } from '@/utils/hooks/useTableData';

interface Props {
  handleEdit: (id: string) => void;
  handleDelete: (id: string, props: DeleteProps) => void;
  deleteProps: DeleteProps;
}

export const useColumns = ({ handleEdit, handleDelete, deleteProps }: Props) => [
  {
    title: '日期',
    dataIndex: 'date',

    render: (timeLine: string) => <>{dayjs(timeLine).format('YYYY-MM-DD')}</>
  },
  {
    title: '日志内容',
    dataIndex: 'logContent',
    render: (arr: string[]) =>
      arr.map((item, index) => (
        <div key={index}>
          {item}
          <br />
        </div>
      ))
  },
  {
    title: '操作',

    render: (_: any, { _id }: { _id: string }) => (
      <>
        <Button
          style={{ marginRight: 10 }}
          type='primary'
          onClick={() => handleEdit(_id)}
        >
          修改
        </Button>
        <Popconfirm
          position='br'
          title='确定要删除该日志吗？'
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
