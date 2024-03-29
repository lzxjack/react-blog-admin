import { Message, Popconfirm } from '@arco-design/web-react';
import React from 'react';
import { IoHome, IoLogOut } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

import { isAdmin } from '@/utils/cloudBase';
import { blogUrl, nowEnv, userAvatar, visitorAvatar } from '@/utils/constant';
import { useTime } from '@/utils/hooks/useTime';

import s from './index.scss';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { timeText } = useTime();

  const logout = () => {
    localStorage.clear();
    Message.success('已退出个人博客后台管理系统！');
    navigate('/');
  };

  const getAvatar = () => (isAdmin() ? userAvatar : visitorAvatar);
  const getName = () => (isAdmin() ? '飞鸟' : '游客');

  return (
    <div className={s.headerBox}>
      <img src={getAvatar()} alt='' className={s.avatar} />
      <div className={s.avatarText}>
        {timeText}，
        <span className={s.userName}>{nowEnv === 'test' ? '测试用户' : getName()}</span>！
      </div>
      <a className={s.blogBtn} href={blogUrl} target='_blank'>
        <IoHome />
      </a>
      <Popconfirm
        title='确定退出吗？'
        position='br'
        onOk={logout}
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
