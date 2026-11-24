import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Mock data showing sentiment volatility over the last 7 days
const data = [
  { date: 'Jul 04', positive: 65, negative: 30, neutral: 5 }, // Baseline
  { date: 'Jul 05', positive: 68, negative: 28, neutral: 4 }, // Baseline
  { date: 'Jul 06', positive: 50, negative: 45, neutral: 5 }, // Crisis: AeroMY baggage delay
  { date: 'Jul 07', positive: 65, negative: 25, neutral: 10 }, // Recovery
  { date: 'Jul 08', positive: 82, negative: 10, neutral: 8 }, // Campaign Launch: #CutiCutiMalaysia
  { date: 'Jul 09', positive: 85, negative: 8, neutral: 7 },  // Continued success
  { date: 'Jul 10', positive: 88, negative: 5, neutral: 7 },  // High sentiment
];

export default function SentimentTrendline() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">Sentiment Velocity (7-Day Trend)</h3>
        <p className="text-sm text-slate-500">Tracking positive vs. negative narrative momentum.</p>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area type="monotone" dataKey="positive" name="Positive %" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorPos)" />
            <Area type="monotone" dataKey="negative" name="Negative %" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorNeg)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
