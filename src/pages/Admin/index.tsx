import classNames from 'classnames';
import React from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import RequireAuth from '@/components/RequireAuth';
import { AppName } from '@/utils/constant';

import { RouteType, useRoutes } from './config';
import s from './index.scss';

const Admin: React.FC = () => {
  const routes = useRoutes();

  return (
    <div className={s.adminBox}>
      {/* 左侧导航区 */}
      <nav className={s.leftNav}>
        <div className={s.appName}>{AppName}</div>
        <ul>
          {routes.map((item: RouteType) => {
            return item.disPlayName ? (
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
            ) : null;
          })}
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
