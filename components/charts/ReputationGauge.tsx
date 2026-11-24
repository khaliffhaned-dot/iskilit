import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface ReputationGaugeProps {
  score: number;
  theme: 'light' | 'dark';
}

const ReputationGauge: React.FC<ReputationGaugeProps> = ({ score, theme }) => {
    const data = [{ value: score }, { value: 100 - score }];
    
    let scoreColor = '#EF4444'; // red-500
    if (score > 75) scoreColor = '#22c55e'; // green-500
    else if (score > 40) scoreColor = '#facc15'; // yellow-400

    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    cx="50%"
                    cy="70%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius="70%"
                    outerRadius="100%"
                    paddingAngle={0}
                    stroke="none"
                >
                    <Cell fill={scoreColor} />
                    <Cell fill={theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)'} />
                </Pie>
                <text 
                    x="50%" 
                    y="60%" 
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    style={{ fontSize: '48px', fontWeight: 'bold', fill: scoreColor }}
                >
                    {score}
                </text>
                <text 
                    x="50%" 
                    y="75%" 
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    style={{ fontSize: '14px', fill: theme === 'dark' ? '#94a3b8' : '#6b7280' }}
                >
                    Reputation Score
                </text>
            </PieChart>
        </ResponsiveContainer>
    );
};
export default ReputationGauge;