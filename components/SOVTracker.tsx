import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Card from './Card';

const data = [
  { name: 'AeroMY', value: 45, color: '#3B82F6' },
  { name: 'Crest Air', value: 30, color: '#10B981' },
  { name: 'National Airways', value: 25, color: '#F59E0B' },
];

export const SOVTracker: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <Card 
      title="Share of Voice (SOV)" 
      className={`${className} flex flex-col justify-between`}
      titleClassName="!text-sm !font-bold !tracking-wider !text-slate-500 !uppercase !mb-4"
    >
      <div className="flex-grow min-h-[260px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ background: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
            />
            <Legend 
              verticalAlign="bottom" 
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', color: '#475569', marginTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Symmetrical metrics bar to fill the card base and match the radar heatmap legend */}
      <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-100 text-center">
        <div className="bg-slate-50/50 p-1.5 rounded-lg border border-slate-100">
          <p className="text-[9px] text-slate-400 font-bold uppercase">AeroMY</p>
          <p className="text-xs font-black text-blue-600">45.0%</p>
        </div>
        <div className="bg-slate-50/50 p-1.5 rounded-lg border border-slate-100">
          <p className="text-[9px] text-slate-400 font-bold uppercase">Crest</p>
          <p className="text-xs font-black text-emerald-600">30.0%</p>
        </div>
        <div className="bg-slate-50/50 p-1.5 rounded-lg border border-slate-100">
          <p className="text-[9px] text-slate-400 font-bold uppercase">National</p>
          <p className="text-xs font-black text-amber-500">25.0%</p>
        </div>
      </div>
    </Card>
  );
};

