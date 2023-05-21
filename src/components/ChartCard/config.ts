import { useMount, useRequest } from 'ahooks';
import { useDispatch, useSelector } from 'react-redux';

import { selectArticle, selectClass } from '@/redux/selectors';
import { setClasses } from '@/redux/slices/classes';
import { getDataAPI } from '@/utils/apis/getData';
import { _ } from '@/utils/cloudBase';
import { DB } from '@/utils/dbConfig';

interface ClassType {
  class: string;
  count: number;
  _id: string;
  _openid: string;
}

export const useChartData = () => {
  const classes = useSelector(selectClass);
  const articles = useSelector(selectArticle);
  const dispatch = useDispatch();

  const formatData = (classData: ClassType[], total: number) => {
    if (classData === undefined || total === undefined) return [];
    let sum = 0;

    const res = classData
      .filter(obj => obj.count !== 0)
      .map(obj => {
        sum += obj.count;
        return { name: obj.class, value: obj.count };
      });
    const leave = total - sum;
    leave &&
      res.push({
        name: '未分类',
        value: leave
      });
    return res;
  };

  const { loading: dataLoading, run: classRun } = useRequest(() => getDataAPI(DB.Class), {
    retryCount: 3,
    manual: true,
    onSuccess: res => {
      dispatch(setClasses(res.data));
    }
  });

  useMount(() => {
    if (!classes.isDone) {
      classRun();
    }
  });

  return {
    loading: dataLoading,
    option: {
      tooltip: {
        trigger: 'item',
        textStyle: {
          fontSize: 16,
          fontFamily: 'dengxian'
        }
      },
      series: [
        {
          type: 'pie',
          radius: '80%',
          height: '100%',
          data: formatData(classes.value, articles.count.value),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            fontSize: 18,
            fontFamily: 'dengxian'
          }
        }
      ]
    }
  };
};
