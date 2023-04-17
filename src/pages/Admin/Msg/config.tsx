import { Button, Popconfirm } from '@arco-design/web-react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';

import { blogUrl } from '@/utils/constant';
import { DeleteProps } from '@/utils/hooks/useTableData';

import s from './index.scss';

interface Props {
  handleDelete: (id: string, props: DeleteProps) => void;
  deleteProps: DeleteProps;
}

export const useColumns = ({ handleDelete, deleteProps }: Props) => [
  {
    title: '昵称',
    dataIndex: 'name',
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
    dataIndex: 'email'
  },
  {
    title: '网址',
    dataIndex: 'link',
    render: (text: string) => (
      <a href={text} target='_blank' rel='noreferrer'>
        {text}
      </a>
    )
  },
  {
    title: '日期',
    dataIndex: 'date',
    render: (text: string) => <>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</>
  },
  {
    title: '类型',

    render: (_: any, { postTitle, replyId }: { postTitle: string; replyId: string }) => (
      <div className={s.typeBox}>
        <div
          className={postTitle ? s.comment : s.msg}
          style={replyId ? { marginRight: 5 } : {}}
        >
          {postTitle ? '文章评论' : '留言板'}
        </div>
        {replyId && <div className={s.reply}>回复</div>}
      </div>
    )
  },
  {
    title: '内容',
    dataIndex: 'content',

    width: 400,
    render: (text: string) => <div className={s.msgsContent}>{text}</div>
  },
  {
    title: '操作',
    render: (_: any, { postTitle, _id }: { postTitle: string; _id: string }) => (
      <>
        <Button
          style={{ marginRight: 10 }}
          type='primary'
          onClick={() => {
            const url = postTitle
              ? `${blogUrl}/post?title=${postTitle}`
              : `${blogUrl}/msg`;
            window.open(url);
          }}
        >
          查看
        </Button>
        <Popconfirm
          position='br'
          title='确定要删除该留言吗？'
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
