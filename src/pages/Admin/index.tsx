import {
  HomeOutlined,
  LoadingOutlined,
  SettingFilled,
  SmileOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useTitle } from 'ahooks';
import { Button } from 'antd';
import React from 'react';

const Admin: React.FC = () => {
  useTitle('Admin');
  return (
    <>
      <Button type='primary'>按钮</Button>
      <HomeOutlined />
      <SettingFilled />
      <SmileOutlined />
      <SyncOutlined spin />
      <SmileOutlined rotate={180} />
      <LoadingOutlined />
    </>
  );
};

export default Admin;
