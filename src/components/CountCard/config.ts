import {
  setArticleSum,
  setDraftSum,
  setLinkSum,
  setMsgSum,
  setSaySum
} from '@/redux/slices/dataSum';
import { DB } from '@/utils/apis/dbConfig';

export const useCardMap = () => ({
  article: { name: '文章', DBName: DB.Article, setSum: setArticleSum },
  draft: { name: '草稿', DBName: DB.Draft, setSum: setDraftSum },
  link: { name: '友链', DBName: DB.Link, setSum: setLinkSum },
  msg: { name: '留言', DBName: DB.Msg, setSum: setMsgSum },
  say: { name: '说说', DBName: DB.Say, setSum: setSaySum }
});
