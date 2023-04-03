// import { Popconfirm, Space } from 'antd';
// import React from 'react';

// interface Props {
//   editLink: Function;
//   deleteLink: Function;
// }

// export const usecolums = ({ editLink, deleteLink }: Props) => [
//   {
//     title: 'Name',
//     dataIndex: 'name',
//     key: '_id',
//     render: (text: string) => <strong>{text}</strong>
//   },
//   {
//     title: 'Link',
//     dataIndex: 'link',
//     key: '_id',
//     render: (text: string) => (
//       <a href={text} target='_blank' rel='noreferrer'>
//         {text}
//       </a>
//     )
//   },
//   {
//     title: 'Avatar',
//     dataIndex: 'avatar',
//     key: '_id'
//   },
//   {
//     title: 'Descr',
//     dataIndex: 'descr',
//     key: '_id'
//   },
//   {
//     title: '操作',
//     key: '_id',
//     render: (record: { _id: any }) => (
//       <Space size='middle'>
//         <Button type='primary' onClick={() => editLink(record._id)}>
//           修改
//         </Button>

//         <Popconfirm
//           placement='topRight'
//           title='确定要删除该友链吗？'
//           onConfirm={() => deleteLink(record._id)}
//           okText='Yes'
//           cancelText='No'
//         >
//           <Button type='primary' danger>
//             删除
//           </Button>
//         </Popconfirm>
//       </Space>
//     )
//   }
// ];

export {};
