import React, { useState, useEffect } from 'react';
import Card from './Card';

export const KeyMessagePenetration: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation shortly after mount
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const messages = [
    { topic: "Commitment to Punctuality", target: 80, actual: 82, trend: "+5%" },
    { topic: "Accessible B40 Fares", target: 70, actual: 65, trend: "+12%" },
    { topic: "Sustainable Aviation (ESG)", target: 50, actual: 41, trend: "-2%" },
  ];

  return (
    <Card 
      title="Key Message Penetration" 
      className={`${className} flex flex-col justify-between h-full`}
      titleClassName="!text-sm !font-bold !tracking-wider !text-slate-500 !uppercase !mb-4"
    >
      <div className="flex-grow flex flex-col justify-around py-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="group cursor-pointer">
            <div className="flex justify-between text-xs mb-2">
              <span className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{msg.topic}</span>
              <span className="font-bold text-blue-600">{msg.actual}%</span>
            </div>
            
            {/* Progress Bar Track */}
            <div className="w-full bg-slate-100 rounded-full h-2 relative overflow-hidden">
              {/* Target Marker */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10" 
                style={{ left: `${msg.target}%` }}
                title={`Target: ${msg.target}%`}
              ></div>
              {/* Actual Fill */}
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ease-out ${msg.actual >= msg.target ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                style={{ width: isLoaded ? `${msg.actual}%` : '0%' }}
              ></div>
            </div>
            
            <div className="text-[10px] text-slate-500 mt-1.5 flex justify-between">
              <span>Target: {msg.target}%</span>
              <span className={`font-semibold ${msg.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                Trend: {msg.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Symmetrical insights footer */}
      <div className="mt-2 pt-3 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
        <span className="font-bold uppercase tracking-wider">Campaign Velocity</span>
        <span className="font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Optimal (2/3 Targets)</span>
      </div>
    </Card>
  );
};


