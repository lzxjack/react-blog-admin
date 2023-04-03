import { notification, Popconfirm } from 'antd';
import React from 'react';
import { IoHome, IoLogOut } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

import { blogUrl } from '@/utils/constant';

import s from './index.scss';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    notification.success({
      message: '退出登录',
      description: '已退出个人博客后台管理系统！',
      placement: 'bottomLeft',
      duration: 1.5
    });
    navigate('/');
  };

  return (
    <div className={s.headerBox}>
      <a className={s.blogBtn} href={blogUrl} target='_blank'>
        <IoHome />
      </a>
      <Popconfirm
        title='确定退出吗？'
        placement='bottomRight'
        onConfirm={logout}
        okText='Yes'
        cancelText='No'
      >
        <div className={s.logoutBtn}>
          <IoLogOut />
        </div>
      </Popconfirm>
    </div>
  );
};

export default Header;
