// /react-app/src/components/charts/RateChart.tsx

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label
} from 'recharts';
import './ChartStyles.css';

interface RateDataPoint {
    time: string;
    rate: number;
    [key: string]: any;
}

interface RateChartProps {
    data: RateDataPoint[];
    title?: string;
    height?: number;
    xAxisDataKey?: string;
    yAxisDataKey?: string;
    lineColor?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    isLoading?: boolean;
}

const RateChart: React.FC<RateChartProps> = ({
                                                 data,
                                                 title = "Rate Over Time",
                                                 height = 300,
                                                 xAxisDataKey = "time",
                                                 yAxisDataKey = "rate",
                                                 lineColor = "#8884d8",
                                                 xAxisLabel = "Time",
                                                 yAxisLabel = "Rate",
                                                 isLoading = false
                                             }) => {
    if (isLoading) {
        return <div className="chart-loading">Loading chart data...</div>;
    }

    if (!data || data.length === 0) {
        return <div className="chart-no-data">No rate data available</div>;
    }

    return (
        <div className="chart-container">
            {title && <h3 className="chart-title">{title}</h3>}
            <ResponsiveContainer width="100%" height={height}>
                <LineChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 50
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey={xAxisDataKey}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                    >
                        <Label value={xAxisLabel} offset={-20} position="insideBottom" />
                    </XAxis>
                    <YAxis>
                        <Label value={yAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                    </YAxis>
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey={yAxisDataKey}
                        stroke={lineColor}
                        activeDot={{ r: 8 }}
                        name={yAxisLabel}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RateChart;