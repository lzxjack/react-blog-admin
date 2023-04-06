import { Popconfirm } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';

import MyButton from '@/components/MyButton';

import s from './index.scss';

interface Props {
  handleOpenMsg: (postTitle: string) => void;
  handleDelete: (id: string) => void;
}

export const useColumns = ({ handleOpenMsg, handleDelete }: Props) => [
  {
    title: '昵称',
    dataIndex: 'name',
    key: '_id',
    render: (text: string) => (
      <div className={s.msgUserNameBox}>
        <div className={classNames(s.msgUserName, { [s.msgUserAdmin]: text === '飞鸟' })}>
          {text}
        </div>
      </div>
    )
  },
  {
    title: '联系邮箱',
    dataIndex: 'email',
    key: '_id'
  },
  {
    title: '网址',
    dataIndex: 'link',
    key: '_id',
    render: (text: string) => (
      <a href={text} target='_blank' rel='noreferrer'>
        {text}
      </a>
    )
  },
  {
    title: '日期',
    dataIndex: 'date',
    key: '_id',
    render: (text: string) => <>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</>
  },
  {
    title: '类型',
    key: '_id',
    render: (record: { postTitle: string; replyId: string }) => (
      <div className={s.typeBox}>
        <div
          className={record.postTitle ? s.comment : s.msg}
          style={record.replyId ? { marginRight: '5px' } : {}}
        >
          {record.postTitle ? '文章评论' : '留言板'}
        </div>
        {record.replyId && <div className={s.reply}>回复</div>}
      </div>
    )
  },
  {
    title: '内容',
    dataIndex: 'content',
    key: '_id',
    width: '400px',
    render: (text: string) => <div className={s.msgsContent}>{text}</div>
  },
  {
    title: '操作',
    key: '_id',
    render: (record: { postTitle: string; _id: string }) => (
      <>
        <MyButton
          style={{ marginRight: '10px' }}
          text='查看'
          small
          onClick={() => handleOpenMsg(record.postTitle)}
        />
        <Popconfirm
          placement='bottomRight'
          title='确定要删除该留言吗？'
          onConfirm={() => handleDelete(record._id)}
          okText='Yes'
          cancelText='No'
        >
          <MyButton text='删除' small danger />
        </Popconfirm>
      </>
    )
  }
];
