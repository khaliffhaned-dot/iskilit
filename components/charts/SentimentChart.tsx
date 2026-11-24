import * as React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const COLORS: { [key: string]: string } = {
    Positive: '#22c55e',
    Neutral: '#64748b',
    Negative: '#ef4444',
    Opportunity: '#f59e0b',
};
const FALLBACK_COLOR = '#a855f7'; // A fallback for any other sentiment types

const CustomTooltipPie: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border border-slate-200 rounded-lg shadow-lg">
                <p className="font-bold text-slate-800">{`${payload[0].name}: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

// Define a type for the expected data items.
interface ChartDataItem {
    sentiment: string;
    [key: string]: any; // Allow other properties
}

interface SentimentChartProps {
    data: (ChartDataItem | undefined | null)[];
}

const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
    if (!data) {
        return <div className="h-full flex items-center justify-center text-slate-500">No sentiment data available.</div>;
    }

    // Filter out any null or undefined items and ensure sentiment is a string
    const validData = data.filter((item): item is ChartDataItem => !!item && typeof item.sentiment === 'string');

    // Dynamically process sentiments from the data
    const sentimentCounts = validData.reduce((acc, item) => {
        acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(sentimentCounts)
        .map(([name, value]) => ({ name, value }))
        .filter(item => item.value > 0);

    if (pieData.length === 0) {
        return <div className="h-full flex items-center justify-center text-slate-500">No sentiment data available.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5}>
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[entry.name] || FALLBACK_COLOR} />)}
                </Pie>
                <Tooltip content={<CustomTooltipPie />} />
                <Legend wrapperStyle={{ color: '#475569' }} iconType="circle" />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default SentimentChart;