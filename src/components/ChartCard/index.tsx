import { IconLoading } from '@arco-design/web-react/icon';
import classNames from 'classnames';
import { PieChart } from 'echarts/charts';
import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import React from 'react';

import { useChartData } from './config';
import s from './index.scss';

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);

const ChartCard: React.FC = () => {
  const { option, loading } = useChartData();

  return (
    <div className={classNames(s.chartBox, { [s.loadingCenter]: loading })}>
      <div className={s.chartTitle}>文章概览</div>
      {loading ? (
        <IconLoading className={s.loading} />
      ) : (
        <ReactEChartsCore
          style={{
            height: '100%'
          }}
          echarts={echarts}
          option={option}
          notMerge={true}
          lazyUpdate={true}
        />
      )}
    </div>
  );
};

export default ChartCard;
