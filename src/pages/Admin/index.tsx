import classNames from 'classnames';
import React from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';

import RequireAuth from '@/components/RequireAuth';
import { AppName } from '@/utils/constant';

import { RouteType, useRoutes } from './config';
import s from './index.scss';

const Admin: React.FC = () => {
  const routes = useRoutes();

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
  );
};

export default Admin;
