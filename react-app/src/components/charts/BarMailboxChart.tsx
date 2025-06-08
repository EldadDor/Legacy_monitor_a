// /react-app/src/components/charts/BarMailboxChart.tsx

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label
} from 'recharts';
import './ChartStyles.css';

interface MailboxStatusData {
    mailbox: string;
    pending: number;
    completed: number;
    failed: number;
    [key: string]: any;
}

interface BarMailboxChartProps {
    data: MailboxStatusData[];
    title?: string;
    height?: number;
    isLoading?: boolean;
    colors?: {
        pending?: string;
        completed?: string;
        failed?: string;
    };
}

const BarMailboxChart: React.FC<BarMailboxChartProps> = ({
                                                             data,
                                                             title = "Mailbox Processing Status",
                                                             height = 400,
                                                             isLoading = false,
                                                             colors = {
                                                                 pending: '#FFC107',
                                                                 completed: '#4CAF50',
                                                                 failed: '#F44336'
                                                             }
                                                         }) => {
    if (isLoading) {
        return <div className="chart-loading">Loading chart data...</div>;
    }

    if (!data || data.length === 0) {
        return <div className="chart-no-data">No mailbox data available</div>;
    }

    // Calculate totals for tooltip
    const enhancedData = data.map(item => ({
        ...item,
        total: item.pending + item.completed + item.failed
    }));

    return (
        <div className="chart-container">
            {title && <h3 className="chart-title">{title}</h3>}
            <ResponsiveContainer width="100%" height={height}>
                <BarChart
                    data={enhancedData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 50
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="mailbox"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                    >
                        <Label value="Mailbox" offset={-20} position="insideBottom" />
                    </XAxis>
                    <YAxis>
                        <Label value="Items" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                    </YAxis>
                    <Tooltip
                        formatter={(value, name) => {
                            const labels = {
                                pending: 'Pending',
                                completed: 'Completed',
                                failed: 'Failed'
                            };
                            return [value, labels[name as keyof typeof labels] || name];
                        }}
                        labelFormatter={(label) => `Mailbox: ${label}`}
                    />
                    <Legend />
                    <Bar
                        dataKey="completed"
                        fill={colors.completed}
                        name="Completed"
                    />
                    <Bar
                        dataKey="pending"
                        fill={colors.pending}
                        name="Pending"
                    />
                    <Bar
                        dataKey="failed"
                        fill={colors.failed}
                        name="Failed"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarMailboxChart;