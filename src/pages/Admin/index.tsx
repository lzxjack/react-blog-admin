import { notification, Popconfirm } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { IoHome, IoLogOut } from 'react-icons/io5';
import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import RequireAuth from '@/components/RequireAuth';
import { AppName, blogUrl } from '@/utils/constant';

import { RouteType, useRoutes } from './config';
import s from './index.scss';

const Admin: React.FC = () => {
  const routes = useRoutes();
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
    <div className={s.adminBox}>
      {/* 左侧导航区 */}
      <nav className={s.leftNav}>
        <div className={s.appName}>{AppName}</div>
        <ul>
          {routes.map((item: RouteType) => (
            <li key={item.path} className={s.liItem}>
              <NavLink
                to={`/admin/${item.path}`}
                className={({ isActive }) =>
                  isActive ? classNames(s.navItem, s.navItemActive) : s.navItem
                }
              >
                {item.disPlayName}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {/* 右侧内容区域= */}
      <div className={s.rightContent}>
        <Header />
        {/* 路由内容 */}
        <div className={s.routeContent}>
          <Routes>
            {routes.map((item: RouteType) => (
              <Route
                key={item.path}
                path={item.path}
                element={
                  <RequireAuth requireLogin={true} to='/'>
                    {item.element}
                  </RequireAuth>
                }
              />
            ))}
            <Route path='*' element={<Navigate to='home' />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Admin;
