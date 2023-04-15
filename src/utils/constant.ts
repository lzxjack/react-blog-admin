import { authMap } from '../../auth.secret';

type EnvType = 'test' | 'prod';

// 当前环境
export const nowEnv: EnvType = 'test';

// 博客的云环境ID
export const env = authMap[nowEnv as keyof typeof authMap].env;

// 个人基本信息
export const userAvatar = 'https://img.lzxjack.top/img/202304061855646.webp';
export const avatarUrl = 'https://img.lzxjack.top/img/202203302348298.webp';

// 游客帐号信息
export const visitorEmail = '490878306@qq.com';
export const visitorPwd = 'asd123456';
export const visitorAvatar = 'https://img.lzxjack.top/img/202304061850910.webp';

// 站点名称
export const AppName = '飞鸟小站';

// 博客主页url
export const blogUrl = 'https://lzxjack.top';

// 博客后台github
export const githubUrl = 'https://github.com/lzxjack/blog-admin';

// 页面title
export const siteTitle = '飞鸟小站后台管理';

// 数据缓存时间
export const staleTime = 180000;

// 游客修改失败后的提示语句
export const visitorText = '游客不可以修改哦~😆';

// 操作失败后的提示语句
export const failText = '操作失败，请重试！';

// notice数据id
export const noticeId = '2d44d6c2612a2178078ff9f553561764';

// 分页：默认每页数量
export const defaultPageSize = 9;
// 作品 分页
export const showPageSize = 7;
// 建站日志 分页
export const logPageSize = 5;
