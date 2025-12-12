import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ordersChartOptions } from './ChartConfig';
import { useTranslation } from 'react-i18next';

const OrdersChart = ({ data, height = 300 }) => {
    const { t } = useTranslation();

    const chartData = {
        labels: data.map(item => item.month),
        datasets: [
            {
                label: t('admin.dashboard.charts.ordersDataset'),
                data: data.map(item => item.orders),
                backgroundColor: '#ff7f0e',
                borderColor: '#d62728',
                borderWidth: 2,
                borderRadius: 6,
                borderSkipped: false,
            },
        ],
    };

    return (
        <div style={{ height: `${height}px` }}>
            <Bar data={chartData} options={ordersChartOptions} />
        </div>
    );
};

export default OrdersChart;
