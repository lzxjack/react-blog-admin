import React, { lazy } from 'react';

const Home = lazy(
  () => import(/* webpackChunkName:'Home', webpackPrefetch:true */ '@/pages/Admin/Home')
);
const Article = lazy(
  () =>
    import(/* webpackChunkName:'Article', webpackPrefetch:true */ '@/pages/Admin/Article')
);
const Say = lazy(
  () => import(/* webpackChunkName:'Say', webpackPrefetch:true */ '@/pages/Admin/Say')
);
const Msg = lazy(
  () => import(/* webpackChunkName:'Msg', webpackPrefetch:true */ '@/pages/Admin/Msg')
);
const Link = lazy(
  () => import(/* webpackChunkName:'Link', webpackPrefetch:true */ '@/pages/Admin/Link')
);
const Show = lazy(
  () => import(/* webpackChunkName:'Show', webpackPrefetch:true */ '@/pages/Admin/Show')
);
const About = lazy(
  () => import(/* webpackChunkName:'About', webpackPrefetch:true */ '@/pages/Admin/About')
);
const Log = lazy(
  () => import(/* webpackChunkName:'Log', webpackPrefetch:true */ '@/pages/Admin/Log')
);
const Draft = lazy(
  () => import(/* webpackChunkName:'Draft', webpackPrefetch:true */ '@/pages/Admin/Draft')
);
const Deleted = lazy(
  () =>
    import(/* webpackChunkName:'Deleted', webpackPrefetch:true */ '@/pages/Admin/Deleted')
);

export interface RouteType {
  path: string;
  disPlayName: string;
  element: React.ReactNode;
}

export const useRoutes = (): RouteType[] => [
  {
    path: 'home',
    disPlayName: '首页',
    element: <Home />
  },
  {
    path: 'article',
    disPlayName: '文章',
    element: <Article />
  },
  {
    path: 'say',
    disPlayName: '说说',
    element: <Say />
  },
  {
    path: 'msg',
    disPlayName: '留言板',
    element: <Msg />
  },
  {
    path: 'link',
    disPlayName: '友链',
    element: <Link />
  },
  {
    path: 'show',
    disPlayName: '作品',
    element: <Show />
  },
  {
    path: 'about',
    disPlayName: '关于',
    element: <About />
  },
  {
    path: 'log',
    disPlayName: '建站日志',
    element: <Log />
  },
  {
    path: 'draft',
    disPlayName: '草稿箱',
    element: <Draft />
  },
  {
    path: 'deleted',
    disPlayName: '已删除',
    element: <Deleted />
  }
];
