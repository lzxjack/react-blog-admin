import {
  selectArticle,
  selectDraft,
  selectLink,
  selectLog,
  selectMsg,
  selectSay,
  selectShow
} from '@/redux/selectors';
import {
  resetArticleData,
  setArticleCount,
  setArticleData
} from '@/redux/slices/articles';
import { resetDraftData, setDraftCount, setDraftData } from '@/redux/slices/drafts';
import { resetLinkData, setLinkCount, setLinkData } from '@/redux/slices/links';
import { resetLogData, setLogCount, setLogData } from '@/redux/slices/logs';
import { resetMsgData, setMsgCount, setMsgData } from '@/redux/slices/msgs';
import { resetSayData, setSayCount, setSayData } from '@/redux/slices/says';
import { resetShowData, setShowCount, setShowData } from '@/redux/slices/shows';
import { DB } from '@/utils/dbConfig';

export const reduxMap = {
  [DB.Article]: {
    selector: selectArticle,
    countReducer: setArticleCount,
    dataReducer: setArticleData,
    dataResetReducer: resetArticleData
  },
  [DB.Draft]: {
    selector: selectDraft,
    countReducer: setDraftCount,
    dataReducer: setDraftData,
    dataResetReducer: resetDraftData
  },
  [DB.Link]: {
    selector: selectLink,
    countReducer: setLinkCount,
    dataReducer: setLinkData,
    dataResetReducer: resetLinkData
  },
  [DB.Msg]: {
    selector: selectMsg,
    countReducer: setMsgCount,
    dataReducer: setMsgData,
    dataResetReducer: resetMsgData
  },
  [DB.Say]: {
    selector: selectSay,
    countReducer: setSayCount,
    dataReducer: setSayData,
    dataResetReducer: resetSayData
  },
  [DB.Log]: {
    selector: selectLog,
    countReducer: setLogCount,
    dataReducer: setLogData,
    dataResetReducer: resetLogData
  },
  [DB.Show]: {
    selector: selectShow,
    countReducer: setShowCount,
    dataReducer: setShowData,
    dataResetReducer: resetShowData
  }
};
