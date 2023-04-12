import { Popconfirm, Popover } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { IoImage } from 'react-icons/io5';

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
    title: '发布日期',
    dataIndex: 'date',
    key: '_id',
    render: (timeLine: string) => <>{dayjs(timeLine).format('YYYY-MM-DD HH:mm:ss')}</>
  },
  {
    title: '图片',
    dataIndex: 'imgs',
    key: '_id',
    render: (imgs: string[]) =>
      imgs?.length ? (
        <Popover
          placement='right'
          content={
            <div className={s.imgsBox}>
              {imgs?.map((url, index) => (
                <div key={index} className={s.imgDiv}>
                  <img src={url} alt='img' className={s.img} />
                </div>
              ))}
            </div>
          }
          trigger='hover'
        >
          <div className={s.imgHover}>
            <IoImage />
          </div>
        </Popover>
      ) : null
  },
  {
    title: '说说内容',
    dataIndex: 'content',
    key: '_id',
    render: (content: string) => (
      <div style={{ width: '100%', height: '100%' }}>
        <div
          style={{
            margin: 'auto',
            width: '500px'
          }}
        >
          {content}
        </div>
      </div>
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
