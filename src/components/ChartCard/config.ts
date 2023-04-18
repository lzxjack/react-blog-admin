import { useRequest } from 'ahooks';

import { getDataAPI } from '@/utils/apis/getData';
import { getTotalAPI } from '@/utils/apis/getTotal';
import { _ } from '@/utils/cloudBase';
import { staleTime } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';

interface ClassType {
  class: string;
  count: number;
  _id: string;
  _openid: string;
}

export const useChartData = () => {
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

  const { data, loading: dataLoading } = useRequest(() => getDataAPI(DB.Class), {
    retryCount: 3,
    cacheKey: `${DB.Class}-data`,
    staleTime
  });

  const { data: total, loading: totalLoading } = useRequest(
    () => getTotalAPI({ dbName: DB.Article, where: { post: _.eq(true) } }),
    {
      retryCount: 3,
      cacheKey: `${DB.Article}-${JSON.stringify({ post: _.eq(true) })}-total`,
      staleTime
    }
  );

  return {
    loading: dataLoading || totalLoading,
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
          data: formatData(data?.data, total?.total),
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
