// /react-app/src/components/charts/HorizontalChart.tsx

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

interface HorizontalDataItem {
    [key: string]: any;
}

interface BarConfig {
    dataKey: string;
    fill: string;
    name?: string;
    stackId?: string;
}

interface HorizontalChartProps {
    data: HorizontalDataItem[];
    yAxisDataKey: string;
    bars: BarConfig[];
    title?: string;
    height?: number;
    xAxisLabel?: string;
    isLoading?: boolean;
}

const HorizontalChart: React.FC<HorizontalChartProps> = ({
                                                             data,
                                                             yAxisDataKey,
                                                             bars,
                                                             title,
                                                             height = 300,
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
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 100,
                        bottom: 20
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                    >
                        {xAxisLabel && <Label value={xAxisLabel} offset={-10} position="insideBottom" />}
                    </XAxis>
                    <YAxis
                        type="category"
                        dataKey={yAxisDataKey}
                        width={90}
                    />
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
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HorizontalChart;