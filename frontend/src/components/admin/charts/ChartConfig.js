import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Common chart options
export const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                usePointStyle: true,
                font: {
                    size: 14,
                    weight: 'bold'
                }
            },
        },
        title: {
            display: false,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(0, 0, 0, 0.1)',
                lineWidth: 1
            },
            ticks: {
                font: {
                    size: 12,
                    weight: 'bold'
                }
            }
        },
        x: {
            grid: {
                color: 'rgba(0, 0, 0, 0.1)',
                lineWidth: 1
            },
            ticks: {
                font: {
                    size: 12,
                    weight: 'bold'
                }
            }
        }
    },
};

// Revenue chart specific options
export const revenueChartOptions = {
    ...chartOptions,
    plugins: {
        ...chartOptions.plugins,
        legend: {
            position: 'top',
            labels: {
                usePointStyle: true,
                font: {
                    size: 14,
                    weight: 'bold'
                }
            }
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(0, 0, 0, 0.1)',
                lineWidth: 1
            },
            ticks: {
                font: {
                    size: 12,
                    weight: 'bold'
                },
                callback: function(value) {
                    return new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        minimumFractionDigits: 0
                    }).format(value);
                }
            }
        },
        x: {
            grid: {
                color: 'rgba(0, 0, 0, 0.1)',
                lineWidth: 1
            },
            ticks: {
                font: {
                    size: 12,
                    weight: 'bold'
                }
            }
        }
    },
};

// Orders chart specific options
export const ordersChartOptions = {
    ...chartOptions,
    plugins: {
        ...chartOptions.plugins,
        legend: {
            position: 'top',
            labels: {
                usePointStyle: true,
                font: {
                    size: 14,
                    weight: 'bold'
                }
            }
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(0, 0, 0, 0.1)',
                lineWidth: 1
            },
            ticks: {
                font: {
                    size: 12,
                    weight: 'bold'
                },
                stepSize: 1,
            }
        },
        x: {
            grid: {
                color: 'rgba(0, 0, 0, 0.1)',
                lineWidth: 1
            },
            ticks: {
                font: {
                    size: 12,
                    weight: 'bold'
                }
            }
        }
    },
};
