import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { revenueChartOptions } from './ChartConfig';
import { useTranslation } from 'react-i18next';

const RevenueChart = ({ data, height = 300 }) => {
    const { t, i18n } = useTranslation();
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

    const options = useMemo(() => ({
        ...revenueChartOptions,
        scales: {
            ...revenueChartOptions.scales,
            y: {
                ...revenueChartOptions.scales?.y,
                ticks: {
                    ...revenueChartOptions.scales?.y?.ticks,
                    callback(value) {
                        return new Intl.NumberFormat(locale, {
                            style: 'currency',
                            currency: 'VND',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(value);
                    }
                }
            }
        }
    }), [locale]);

    const chartData = {
        labels: data.map(item => item.month),
        datasets: [
            {
                label: t('admin.dashboard.charts.revenueDataset'),
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
            <Line data={chartData} options={options} />
        </div>
    );
};

export default RevenueChart;
