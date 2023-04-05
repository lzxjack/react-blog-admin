import { DB } from '@/utils/apis/dbConfig';

export const dataMap = {
  article: { name: '文章', DBName: DB.Article },
  draft: { name: '草稿', DBName: DB.Draft },
  link: { name: '友链', DBName: DB.Link },
  msg: { name: '留言', DBName: DB.Msg },
  say: { name: '说说', DBName: DB.Say }
};
