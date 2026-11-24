import React from 'react';
import Card from './Card';

export const ActiveStrategicInitiatives: React.FC<{ className?: string }> = ({ className = '' }) => {
  const initiatives = [
    { 
      name: "Q3 Market Listing Prep", 
      status: "On Track", 
      sentiment: "Positive", 
      health: "bg-emerald-500 shadow-emerald-200" 
    },
    { 
      name: "East Coast Fleet Expansion", 
      status: "Under Review", 
      sentiment: "Neutral", 
      health: "bg-amber-400 shadow-amber-200" 
    },
    { 
      name: "SME Vendor Program Comms", 
      status: "Action Needed", 
      sentiment: "Volatile", 
      health: "bg-red-500 shadow-red-200 animate-pulse" 
    },
  ];

  return (
    <Card 
      title="Active Strategic Initiatives" 
      className={`${className}`}
      titleClassName="!text-sm !font-bold !tracking-wider !text-slate-500 !uppercase !mb-5"
    >
      <div className="space-y-2.5">
        {initiatives.map((item, idx) => (
          <div key={idx} className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all duration-200 cursor-pointer group">
            <div className="flex justify-between items-start mb-1.5">
              <h4 className="font-semibold text-slate-850 group-hover:text-blue-600 transition-colors text-xs">{item.name}</h4>
              
              {/* Health Indicator Dot */}
              <span className="relative flex h-2.5 w-2.5 mt-0.5">
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 shadow-lg ${item.health}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${item.health.split(' ')[0]}`}></span>
              </span>
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-200 border-dashed">
              <span>Status: <span className="font-semibold text-slate-700">{item.status}</span></span>
              <span>Sentiment: <span className={`font-semibold ${item.sentiment === 'Positive' ? 'text-emerald-600' : item.sentiment === 'Volatile' ? 'text-red-500' : 'text-slate-700'}`}>{item.sentiment}</span></span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

