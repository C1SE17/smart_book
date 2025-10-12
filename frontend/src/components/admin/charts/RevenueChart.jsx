import React from 'react';
import { Line } from 'react-chartjs-2';
import { revenueChartOptions } from './ChartConfig';

const RevenueChart = ({ data, height = 300 }) => {
    const chartData = {
        labels: data.map(item => item.month),
        datasets: [
            {
                label: 'Doanh thu (₫)',
                data: data.map(item => item.revenue),
                borderColor: '#1f77b4',
                backgroundColor: 'rgba(31, 119, 180, 0.3)',
                tension: 0,
                fill: true,
                pointBackgroundColor: '#1f77b4',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 3,
                pointRadius: 8,
                pointHoverRadius: 10,
                borderWidth: 4,
            },
        ],
    };

    return (
        <div style={{ height: `${height}px` }}>
            <Line data={chartData} options={revenueChartOptions} />
        </div>
    );
};

export default RevenueChart;
