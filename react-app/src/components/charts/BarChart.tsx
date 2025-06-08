// /react-app/src/components/charts/BarChart.tsx

import React from 'react';
import {
    BarChart as RechartsBarChart,
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

interface BarDataItem {
    [key: string]: any;
}

interface BarConfig {
    dataKey: string;
    fill: string;
    name?: string;
    stackId?: string;
}

interface BarChartProps {
    data: BarDataItem[];
    xAxisDataKey: string;
    bars: BarConfig[];
    title?: string;
    height?: number;
    yAxisLabel?: string;
    xAxisLabel?: string;
    isLoading?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
                                               data,
                                               xAxisDataKey,
                                               bars,
                                               title,
                                               height = 300,
                                               yAxisLabel,
                                               xAxisLabel,
                                               isLoading = false
                                           }) => {
    if (isLoading) {
        return <div className="chart-loading">Loading chart data...</div>;
    }

    if (!data || data.length === 0) {
        return <div className="chart-no-data">No data available</div>;
    }

    return (
        <div className="chart-container">
            {title && <h3 className="chart-title">{title}</h3>}
            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart
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
                        {xAxisLabel && <Label value={xAxisLabel} offset={-20} position="insideBottom" />}
                    </XAxis>
                    <YAxis>
                        {yAxisLabel && <Label value={yAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />}
                    </YAxis>
                    <Tooltip />
                    <Legend />
                    {bars.map((bar, index) => (
                        <Bar
                            key={index}
                            dataKey={bar.dataKey}
                            fill={bar.fill}
                            name={bar.name || bar.dataKey}
                            stackId={bar.stackId}
                        />
                    ))}
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChart;