import { DB } from '@/utils/apis/dbConfig';

export const useCountCarts = () => [
  {
    title: '文章',
    DBName: DB.Article
  },
  {
    title: '草稿',
    DBName: DB.Draft
  },
  {
    title: '友链',
    DBName: DB.Link
  },
  {
    title: '留言',
    DBName: DB.Msg
  },
  {
    title: '说说',
    DBName: DB.Say
  }
];
