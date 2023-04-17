import React, { lazy } from 'react';
import {
  BiDetail,
  BiEdit,
  BiHomeAlt2,
  BiListOl,
  BiMessageRoundedDots,
  BiNews,
  BiShareAlt,
  BiTaskX,
  BiTrophy
} from 'react-icons/bi';

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
const AddArticle = lazy(
  () =>
    import(
      /* webpackChunkName:'AddArticle', webpackPrefetch:true */ '@/pages/Admin/AddArticle'
    )
);
const AboutEdit = lazy(
  () =>
    import(
      /* webpackChunkName:'AboutEdit', webpackPrefetch:true */ '@/pages/Admin/AboutEdit'
    )
);

export interface RouteType {
  path: string;
  disPlayName: string;
  element: React.ReactNode;
  icon?: React.ReactNode;
}

export const useRoutes = (): RouteType[] => [
  {
    path: 'home',
    disPlayName: '首页',
    element: <Home />,
    icon: <BiHomeAlt2 />
  },
  {
    path: 'article',
    disPlayName: '文章',
    element: <Article />,
    icon: <BiDetail />
  },
  {
    path: 'say',
    disPlayName: '说说',
    element: <Say />,
    icon: <BiMessageRoundedDots />
  },
  {
    path: 'msg',
    disPlayName: '留言板',
    element: <Msg />,
    icon: <BiEdit />
  },
  {
    path: 'link',
    disPlayName: '友链',
    element: <Link />,
    icon: <BiShareAlt />
  },
  {
    path: 'show',
    disPlayName: '作品',
    element: <Show />,
    icon: <BiTrophy />
  },
  {
    path: 'log',
    disPlayName: '建站日志',
    element: <Log />,
    icon: <BiListOl />
  },
  {
    path: 'about',
    disPlayName: '关于',
    element: <About />,
    icon: <BiNews />
  },
  {
    path: 'draft',
    disPlayName: '草稿箱',
    element: <Draft />,
    icon: <BiTaskX />
  },
  {
    path: 'addArticle',
    disPlayName: '',
    element: <AddArticle />
  },
  {
    path: 'aboutEdit',
    disPlayName: '',
    element: <AboutEdit />
  }
];
