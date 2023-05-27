import { Button, Popconfirm, Popover } from '@arco-design/web-react';
import dayjs from 'dayjs';
import React from 'react';
import { IoImage } from 'react-icons/io5';

import { DeleteProps } from '@/utils/hooks/useTableData';

import s from './index.scss';

interface Props {
  handleEdit: (id: string) => void;
  handleDelete: (id: string, props: DeleteProps) => void;
  deleteProps: DeleteProps;
  onClickImg: (url: string) => void;
}

export const useColumns = ({
  handleEdit,
  handleDelete,
  deleteProps,
  onClickImg
}: Props) => [
  {
    title: '发布日期',
    dataIndex: 'date',
    render: (timeLine: string) => <>{dayjs(timeLine).format('YYYY-MM-DD HH:mm:ss')}</>
  },
  {
    title: '图片',
    dataIndex: 'imgs',
    render: (imgs: string[]) =>
      imgs?.length ? (
        <Popover
          position='right'
          className={s.imgsPopover}
          content={
            <div className={s.imgsBox}>
              {imgs?.map((url, index) => (
                <div key={index} className={s.imgDiv} onClick={() => onClickImg(url)}>
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
    render: (content: string) => (
      <div style={{ width: '100%', height: '100%' }}>
        <div
          style={{
            margin: 'auto',
            width: 500
          }}
        >
          {content}
        </div>
      </div>
    )
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
          修改
        </Button>
        <Popconfirm
          position='br'
          title='确定要删除该说说吗？'
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
