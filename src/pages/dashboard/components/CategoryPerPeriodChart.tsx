import type { FC } from 'react';
import ReactECharts from 'echarts-for-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getCategoriesPerPeriodQueryOpts } from '@/queries/categories-queries';
import { usePeriod } from '@/hooks/usePeriod';
import dayjs from 'dayjs';

export const CategoryPerPeriod: FC = () => {
  const { period } = usePeriod();

  const { data } = useSuspenseQuery({
    ...getCategoriesPerPeriodQueryOpts(
      dayjs().month(period.month).year(period.year).format('YYYYMM'),
      {
        per_page: 100,
        order_by: 'total_amount:desc',
      },
    ),
  });

  const filteredData = data.data.categories.filter((item) => item.total_amount < 0);

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function (params: { value: number; name: string; percent: string }) {
        return (
          params.name +
          '<br/>' +
          Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
            params.value * -1,
          ) +
          ' (' +
          params.percent +
          '%)'
        );
      },
    },
    legend: {
      top: '5%',
      left: 'center',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 15,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: filteredData.map((category) => ({
          value: Math.abs(category.total_amount),
          name: category.name,
          itemStyle: {
            color: category.color,
          },
          label: {
            formatter: (params: { value: number }) =>
              Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                params.value * -1,
              ),
          },
        })),
      },
    ],
  };

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <img src="/empty_state_donut.webp" alt="" className="size-24" />
        <span className="text-lg font-medium">No transactions with categories yet</span>
        <span>Categorize your transactions to check some insights</span>
      </div>
    );
  }

  return <ReactECharts option={option} />;
};
