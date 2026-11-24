import React from 'react';
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { BrandPerceptionDataPoint } from '../../types.ts';

interface PerceptionRadarChartProps {
  data: BrandPerceptionDataPoint[];
  brands: string[];
}

const COLORS = ['#f59e0b', '#ef4444', '#10b981', '#6366f1'];

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/80 backdrop-blur-sm p-3 border border-slate-200 rounded-lg shadow-lg">
                <p className="font-bold text-slate-800 mb-2">{label}</p>
                {payload.map((pld: any, index: number) => (
                    <p key={index} style={{ color: pld.color }} className="font-semibold text-sm">
                        {`${pld.name}: ${pld.value}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const PerceptionRadarChart: React.FC<PerceptionRadarChartProps> = ({ data, brands }) => {
  if (!data || data.length === 0) {
    return <div className="h-full w-full flex items-center justify-center text-slate-500">No perception data available.</div>;
  }
  
  // Inject a static baseline for the heatmap gradient coverage on all axes
  const enhancedData = data.map(item => ({
    ...item,
    heatmapMax: 100
  }));
  
  return (
    <div className="w-full flex flex-col gap-2">
      {/* Invisible SVG defs for radial gradient heatmap */}
      <svg className="absolute w-0 h-0" width="0" height="0">
        <defs>
          <radialGradient id="radarHeatmap" cx="50%" cy="45%" r="42%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.22" />   {/* Rose/Danger inner core */}
            <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.15" />  {/* Amber/Warning mid zone */}
            <stop offset="75%" stopColor="#10b981" stopOpacity="0.13" />  {/* Emerald/Healthy outer zone */}
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.08" /> {/* Indigo/Dominant peak zone */}
          </radialGradient>
        </defs>
      </svg>

      <ResponsiveContainer width="100%" height={250}>
        <RadarChart cx="50%" cy="45%" outerRadius="80%" data={enhancedData} margin={{ top: 5, right: 5, bottom: -15, left: 5 }}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="attribute" tick={{ fill: '#475569', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'transparent' }} />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Base Heatmap Overlay Radar */}
          <Radar
            name="Resonance Map"
            dataKey="heatmapMax"
            stroke="none"
            fill="url(#radarHeatmap)"
            fillOpacity={1}
            legendType="none"
          />

          {brands.map((brand, index) => (
              <Radar 
                  key={brand}
                  name={brand} 
                  dataKey={brand} 
                  stroke={COLORS[index % COLORS.length]} 
                  fill={COLORS[index % COLORS.length]} 
                  fillOpacity={0.08} 
                  strokeWidth={2}
              />
          ))}
          <Legend 
            verticalAlign="bottom" 
            height={16} 
            iconSize={8}
            wrapperStyle={{ 
              color: '#475569', 
              fontSize: '11px', 
              paddingTop: '0px',
              marginTop: '-12px'
            }} 
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Heatmap Density Legend Overlay */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-0.5 border-t border-slate-100/80 pt-2 text-[10px] font-bold text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500/20 border border-rose-400/50 inline-block"></span>
          <span>Vulnerable Core (0-40)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500/20 border border-amber-400/50 inline-block"></span>
          <span>Active Traction (40-75)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500/20 border border-emerald-400/50 inline-block"></span>
          <span>Equity Resonance (75-100)</span>
        </div>
      </div>
    </div>
  );
};

export default PerceptionRadarChart;
