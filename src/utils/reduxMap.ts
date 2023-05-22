import {
  selectArticle,
  selectDraft,
  selectLink,
  selectLog,
  selectMsg,
  selectSay,
  selectShow
} from '@/redux/selectors';
import { setArticleCount, setArticleData } from '@/redux/slices/articles';
import { setDraftCount, setDraftData } from '@/redux/slices/drafts';
import { setLinkCount, setLinkData } from '@/redux/slices/links';
import { setLogCount, setLogData } from '@/redux/slices/logs';
import { setMsgCount, setMsgData } from '@/redux/slices/msgs';
import { setSayCount, setSayData } from '@/redux/slices/says';
import { setShowCount, setShowData } from '@/redux/slices/shows';
import { DB } from '@/utils/dbConfig';

export const reduxMap = {
  [DB.Article]: {
    selector: selectArticle,
    countReducer: setArticleCount,
    dataReducer: setArticleData
  },
  [DB.Draft]: {
    selector: selectDraft,
    countReducer: setDraftCount,
    dataReducer: setDraftData
  },
  [DB.Link]: {
    selector: selectLink,
    countReducer: setLinkCount,
    dataReducer: setLinkData
  },
  [DB.Msg]: {
    selector: selectMsg,
    countReducer: setMsgCount,
    dataReducer: setMsgData
  },
  [DB.Say]: {
    selector: selectSay,
    countReducer: setSayCount,
    dataReducer: setSayData
  },
  [DB.Log]: {
    selector: selectLog,
    countReducer: setLogCount,
    dataReducer: setLogData
  },
  [DB.Show]: {
    selector: selectShow,
    countReducer: setShowCount,
    dataReducer: setShowData
  }
};
