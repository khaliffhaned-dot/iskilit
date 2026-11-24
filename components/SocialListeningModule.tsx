import React, { useState, useEffect } from 'react';
import Card from './Card';
import { MessageSquare, TrendingUp, Users } from 'lucide-react';

export const SocialListeningModule: React.FC<{ className?: string }> = ({ className = '' }) => {
  // Starting baseline metrics
  const [volume, setVolume] = useState(45200);
  const [reach, setReach] = useState(1200000);

  // Simulate live data incoming every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setVolume(prev => prev + Math.floor(Math.random() * 45) + 5); 
      setReach(prev => prev + Math.floor(Math.random() * 600) + 120);
    }, 3500); 

    return () => clearInterval(interval);
  }, []);

  // Format numbers to K and M
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const trendingTopics = [
    { topic: '#CutiCutiMalaysia deals', platform: 'TikTok', mentions: '15.2K', sentiment: '+35%', isPositive: true },
    { topic: 'AeroMY baggage delay', platform: 'X', mentions: '9.8K', sentiment: '-18%', isPositive: false },
    { topic: 'WhatsApp Viral Audio', platform: 'WhatsApp', mentions: '7.5K', sentiment: '+12%', isPositive: false },
    { topic: 'New flight route announcement', platform: 'Facebook', mentions: '6.2K', sentiment: '+8%', isPositive: true },
    { topic: 'Telegram group leak', platform: 'Telegram', mentions: '4.1K', sentiment: '+5%', isPositive: false },
  ];

  return (
    <Card 
      title="Malaysia Social Pulse" 
      className={`${className} flex flex-col justify-between`}
      titleClassName="!text-sm !font-bold !tracking-wider !text-slate-500 !uppercase !mb-4"
    >
      <div className="flex flex-col h-full justify-between gap-3">
        {/* Statistics Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-50/50 p-2.5 rounded-lg text-center border border-slate-100 shadow-sm flex flex-col justify-center">
            <TrendingUp size={14} className="text-slate-500 mx-auto mb-0.5" />
            <p className="text-[10px] text-slate-500 font-bold uppercase">Volume</p>
            <p className="font-extrabold text-blue-600 transition-all duration-300 text-sm mt-0.5">{formatNumber(volume)}</p>
          </div>
          <div className="bg-slate-50/50 p-2.5 rounded-lg text-center border border-slate-100 shadow-sm flex flex-col justify-center">
            <Users size={14} className="text-slate-500 mx-auto mb-0.5" />
            <p className="text-[10px] text-slate-500 font-bold uppercase">Reach</p>
            <p className="font-extrabold text-blue-600 transition-all duration-300 text-sm mt-0.5">{formatNumber(reach)}</p>
          </div>
          <div className="bg-slate-50/50 p-2.5 rounded-lg text-center border border-slate-100 shadow-sm flex flex-col justify-center">
            <MessageSquare size={14} className="text-slate-500 mx-auto mb-0.5" />
            <p className="text-[10px] text-slate-500 font-bold uppercase">Sentiment</p>
            <p className="font-extrabold text-emerald-600 text-sm mt-0.5">62%</p>
          </div>
        </div>

        {/* Dynamic Trending List */}
        <div className="space-y-1.5 flex-grow flex flex-col justify-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Real-time Sourced Mentions</p>
          {trendingTopics.map((item, idx) => (
            <div 
              key={idx} 
              className="flex justify-between items-center py-1.5 px-2.5 rounded-lg hover:bg-slate-55/80 bg-slate-50/30 cursor-pointer border border-transparent hover:border-slate-200 transition-all duration-200 group"
            >
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-xs font-semibold text-slate-750 group-hover:text-blue-600 transition-colors truncate">
                  {item.topic}
                </p>
                <p className="text-[9px] text-slate-500 font-medium mt-0.5 truncate">
                  {item.platform} • {item.mentions} mentions
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold ${
                  item.isPositive ? 'text-emerald-700 bg-emerald-100/70' : 'text-red-700 bg-red-100/70'
                }`}>
                  {item.sentiment}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

