import React, { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';

const Article = lazy(
  () => import(/* webpackChunkName:'Article', webpackPrefetch:true */ '@/pages/Article')
);
const About = lazy(
  () => import(/* webpackChunkName:'About', webpackPrefetch:true */ '@/pages/About')
);

export interface routeType {
  path: string;
  Element: React.FC;
  auth: boolean;
}

const getElement = (location: any, loginState: boolean, route: routeType) => {
  const { Element, auth } = route;

  if (auth && !loginState) {
    // 未登录，直接返回登陆页面
    return <Navigate to='/' state={{ from: location }} replace />;
  } else if (!auth && loginState) {
    // 已登录，仍访问登录页，避免不必要的登录，返回home页
    return <Navigate to='/home' state={{ from: location }} replace />;
  } else {
    // 正常访问
    return <Element />;
  }
};

export const renderRoutes = (location: any, loginState: boolean, routes: routeType[]) => {
  return routes.map((item: routeType) => {
    return (
      <Route
        key={item.path}
        path={item.path}
        element={getElement(location, loginState, item)}
      />
    );
  });
};

export const routes: routeType[] = [
  {
    path: 'article',
    Element: Article,
    auth: false
  },
  {
    path: 'about',
    Element: About,
    auth: true
  },
  {
    path: '*',
    Element: About,
    auth: false
  }
];
