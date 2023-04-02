import { Popconfirm } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { IoHome, IoLogOut } from 'react-icons/io5';
import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';

import RequireAuth from '@/components/RequireAuth';
import { AppName, blogUrl } from '@/utils/constant';

import { RouteType, useRoutes } from './config';
import s from './index.scss';

const Admin: React.FC = () => {
  const routes = useRoutes();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className={s.adminBox}>
      {/* 左侧导航区 */}
      <nav className={s.nav}>
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
      <div className={s.content}>
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
      </div>
    </div>
  );
};

export default Admin;
