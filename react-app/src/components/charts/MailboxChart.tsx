// /react-app/src/components/charts/MailboxChart.tsx

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface MailboxChartProps {
    mailboxData: Array<{
        name: string;
        total: number;
        completed: number;
        inProgress: number;
    }>;
    title?: string;
    height?: number;
}

const MailboxChart: React.FC<MailboxChartProps> = ({
                                                       mailboxData,
                                                       title = "Mailbox Status",
                                                       height = 400
                                                   }) => {
    if (!mailboxData || mailboxData.length === 0) {
        return <div className="chart-no-data">No mailbox data available</div>;
    }

    return (
        <div className="chart-container">
            {title && <h3 className="chart-title">{title}</h3>}
            <ResponsiveContainer width="100%" height={height}>
                <BarChart
                    data={mailboxData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 50
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" stackId="a" fill="#4CAF50" name="Completed" />
                    <Bar dataKey="inProgress" stackId="a" fill="#FFC107" name="In Progress" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MailboxChart;