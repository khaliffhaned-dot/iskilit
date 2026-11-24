import React, { useState, useEffect } from 'react';
import Card from './Card';

interface TierDetail {
  source: string;
  reach: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  impactScore: number;
}

export const MediaTierResonance: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [activeScenario, setActiveScenario] = useState<'baseline' | 'crisis' | 'campaign'>('baseline');
  const [isPulseActive, setIsPulseActive] = useState(false);
  const [expandedTier, setExpandedTier] = useState<'tier1' | 'tier2' | 'noise' | null>(null);
  
  // Real-time animation heights state
  const [heights, setHeights] = useState({ tier1: 18, tier2: 34, noise: 85 });
  
  // Live ticker of incoming parsed stories
  const [liveStories, setLiveStories] = useState<Array<{ id: number; tier: string; text: string; time: string; type: 'pos' | 'neg' | 'neu' }>>([
    { id: 1, tier: 'Tier 1', text: 'The Edge Malaysia: AeroMY fleet deployment shows strong Q3 unit economics', time: 'Just Now', type: 'pos' },
    { id: 2, tier: 'Noise', text: 'X (Twitter): Viral complaint regarding AMY-304 cabin air conditioning', time: '2m ago', type: 'neg' },
    { id: 3, tier: 'Tier 2', text: 'SoyaCincau: AeroMY rolls out in-flight Wi-Fi for domestic East Coast routes', time: '12m ago', type: 'pos' }
  ]);

  // Adjust heights based on activeScenario and timeframe
  useEffect(() => {
    let base = { tier1: 18, tier2: 34, noise: 85 };
    if (activeScenario === 'crisis') {
      base = { tier1: 12, tier2: 25, noise: 98 };
    } else if (activeScenario === 'campaign') {
      base = { tier1: 45, tier2: 50, noise: 35 };
    }

    // Apply slight modifications based on timeframe
    if (timeframe === '7d') {
      base = { tier1: Math.min(100, base.tier1 + 8), tier2: Math.min(100, base.tier2 + 10), noise: Math.max(15, base.noise - 12) };
    } else if (timeframe === '30d') {
      base = { tier1: Math.min(100, base.tier1 + 15), tier2: Math.min(100, base.tier2 + 15), noise: Math.max(10, base.noise - 25) };
    }

    setHeights(base);
  }, [activeScenario, timeframe]);

  // Handle live pulse simulation interval
  useEffect(() => {
    if (!isPulseActive) return;

    const sourceNames = {
      tier1: ['Astro Awani', 'The Edge Markets', 'Star Biz', 'New Straits Times', 'Malay Mail'],
      tier2: ['SoyaCincau', 'Lowyat.net', 'TechNave', 'Focus Malaysia', 'DagangNews'],
      noise: ['X Community', 'Facebook Group Forum', 'TikTok Viral Reel', 'Reddit r/malaysia']
    };

    const headlines = {
      pos: [
        'AeroMY logs 94% on-time performance rate over the festive week',
        'B40 supportive fare model gains praise in regional aviation review',
        'Corporate expansion into Sandakan routes approved by regulators',
        'Sustainable SAF trial run yields excellent carbon offset data'
      ],
      neg: [
        'Frustrated passengers post thread about check-in kiosk lag at KLIA2',
        'TikTok trend alleges baggage handling takes longer on morning routes',
        'Unverified forum rumor alleges rescheduling of East Coast charter planes',
        'Complaints spike concerning legroom availability on short-haul fleet'
      ],
      neu: [
        'AeroMY schedules standard maintenance shutdown for reservation database',
        'Transport Ministry releases quarterly aviation safety compliance report',
        'Airline associations meet in Kuala Lumpur to discuss regional fuel targets',
        'AeroMY PR lead declines comment on competitor mergers'
      ]
    };

    const interval = setInterval(() => {
      // Pick a random tier
      const randVal = Math.random();
      let tierType: 'tier1' | 'tier2' | 'noise' = 'noise';
      let tierLabel = 'Noise';
      if (randVal > 0.7) {
        tierType = 'tier1';
        tierLabel = 'Tier 1';
      } else if (randVal > 0.4) {
        tierType = 'tier2';
        tierLabel = 'Tier 2';
      }

      // Pick a sentiment type
      const sentType: 'pos' | 'neg' | 'neu' = Math.random() > 0.6 ? 'pos' : Math.random() > 0.4 ? 'neu' : 'neg';
      const sources = sourceNames[tierType];
      const selectedSource = sources[Math.floor(Math.random() * sources.length)];
      const list = headlines[sentType];
      const selectedHeadline = list[Math.floor(Math.random() * list.length)];

      // Construct story
      const newStory = {
        id: Date.now(),
        tier: tierLabel,
        text: `${selectedSource}: ${selectedHeadline}`,
        time: 'Just Now',
        type: sentType
      };

      // Add story to list and limit to 4 items
      setLiveStories(prev => [newStory, ...prev.slice(0, 3)]);

      // Micro-fluctuate the bar heights slightly to simulate living pulse
      setHeights(prev => {
        const delta = sentType === 'pos' ? 3 : sentType === 'neg' ? -3 : 1;
        if (tierType === 'tier1') {
          return { ...prev, tier1: Math.min(100, Math.max(5, prev.tier1 + delta)) };
        } else if (tierType === 'tier2') {
          return { ...prev, tier2: Math.min(100, Math.max(5, prev.tier2 + delta)) };
        } else {
          return { ...prev, noise: Math.min(100, Math.max(5, prev.noise - delta)) };
        }
      });

    }, 3500);

    return () => clearInterval(interval);
  }, [isPulseActive]);

  const tier1Details: TierDetail[] = [
    { source: 'Astro Awani', reach: '2.4M', sentiment: 'positive', impactScore: 88 },
    { source: 'The Edge Markets', reach: '1.1M', sentiment: 'positive', impactScore: 85 },
    { source: 'New Straits Times', reach: '1.8M', sentiment: 'neutral', impactScore: 78 },
    { source: 'Star Biz', reach: '1.5M', sentiment: 'positive', impactScore: 80 }
  ];

  const tier2Details: TierDetail[] = [
    { source: 'Lowyat.net', reach: '800K', sentiment: 'negative', impactScore: 65 },
    { source: 'SoyaCincau', reach: '450K', sentiment: 'positive', impactScore: 70 },
    { source: 'TechNave', reach: '350K', sentiment: 'neutral', impactScore: 58 },
    { source: 'Focus Malaysia', reach: '220K', sentiment: 'neutral', impactScore: 62 }
  ];

  const noiseDetails: TierDetail[] = [
    { source: 'X (Twitter) Viral', reach: '500K', sentiment: 'negative', impactScore: 45 },
    { source: 'Lowyat Forum Threads', reach: '150K', sentiment: 'negative', impactScore: 38 },
    { source: 'TikTok Shorts Feed', reach: '1.2M', sentiment: 'negative', impactScore: 50 },
    { source: 'Facebook Airline Groups', reach: '80K', sentiment: 'neutral', impactScore: 25 }
  ];

  const getSentimentBadge = (type: 'positive' | 'neutral' | 'negative') => {
    switch (type) {
      case 'positive': return <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded font-bold uppercase">Positive</span>;
      case 'negative': return <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.5 rounded font-bold uppercase">Negative</span>;
      default: return <span className="text-[10px] bg-slate-50 text-slate-500 border border-slate-100 px-1.5 py-0.5 rounded font-bold uppercase">Neutral</span>;
    }
  };

  return (
    <Card 
      title="Media Tier Resonance" 
      className={`${className}`}
      titleClassName="!text-sm !font-bold !tracking-wider !text-slate-500 !uppercase"
    >
      {/* Real-time Listening Control Toggle */}
      <div className="flex justify-between items-center mb-4 mt-2">
        <span className="text-xs text-slate-400">Mainstream vs Social Buzz</span>
        <button
          onClick={() => setIsPulseActive(!isPulseActive)}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
            isPulseActive 
              ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse' 
              : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isPulseActive ? 'bg-rose-500 animate-ping' : 'bg-slate-400'}`}></span>
          {isPulseActive ? 'Live Active' : 'Enable Live'}
        </button>
      </div>

      {/* Segment controls for Scenario Switcher */}
      <div className="flex gap-1 bg-slate-100/70 border border-slate-200/50 p-1.5 rounded-xl my-4 text-[10px] font-bold">
        <button 
          onClick={() => setActiveScenario('baseline')} 
          className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all duration-200 ${activeScenario === 'baseline' ? 'bg-white text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.08)] border border-slate-200/60 font-black' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Baseline
        </button>
        <button 
          onClick={() => setActiveScenario('crisis')} 
          className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all duration-200 ${activeScenario === 'crisis' ? 'bg-rose-50 text-rose-600 shadow-[0_2px_8px_rgba(244,63,94,0.1)] border border-rose-200/60 font-black' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Crisis
        </button>
        <button 
          onClick={() => setActiveScenario('campaign')} 
          className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all duration-200 ${activeScenario === 'campaign' ? 'bg-emerald-50 text-emerald-600 shadow-[0_2px_8px_rgba(16,185,129,0.1)] border border-emerald-200/60 font-black' : 'text-slate-500 hover:text-slate-700'}`}
        >
          PR Push
        </button>
      </div>

      {/* Main Bar Chart with Clickable Details */}
      <div className="flex items-end h-28 space-x-3 mb-4 relative">
        {/* Tier 1 Mainstream */}
        <div 
          onClick={() => setExpandedTier(expandedTier === 'tier1' ? null : 'tier1')}
          className={`flex-1 bg-slate-50/70 hover:bg-slate-100/70 rounded-t-xl relative cursor-pointer border-b border-slate-200 group transition-all p-0.5 h-full flex flex-col justify-end items-center ${expandedTier === 'tier1' ? 'ring-2 ring-slate-800' : ''}`}
        >
          <div 
            className="w-full bg-slate-800 rounded-t-md transition-all duration-1000 ease-out"
            style={{ height: `${heights.tier1}%` }}
          ></div>
          
          <div className="absolute top-2 left-0 right-0 flex flex-col items-center text-center">
            <span className="text-[9px] font-bold text-slate-400 group-hover:text-slate-600 tracking-wider uppercase">Tier 1</span>
            <span className="text-xs font-black text-slate-800 mt-0.5">{heights.tier1}%</span>
          </div>
        </div>

        {/* Tier 2 Blogs & Trade */}
        <div 
          onClick={() => setExpandedTier(expandedTier === 'tier2' ? null : 'tier2')}
          className={`flex-1 bg-slate-50/70 hover:bg-slate-100/70 rounded-t-xl relative cursor-pointer border-b border-slate-200 group transition-all p-0.5 h-full flex flex-col justify-end items-center ${expandedTier === 'tier2' ? 'ring-2 ring-blue-600' : ''}`}
        >
          <div 
            className="w-full bg-blue-600 rounded-t-md transition-all duration-1000 ease-out"
            style={{ height: `${heights.tier2}%` }}
          ></div>
          
          <div className="absolute top-2 left-0 right-0 flex flex-col items-center text-center">
            <span className="text-[9px] font-bold text-slate-400 group-hover:text-blue-600 tracking-wider uppercase">Tier 2</span>
            <span className="text-xs font-black text-blue-600 mt-0.5">{heights.tier2}%</span>
          </div>
        </div>

        {/* Social / Forum Noise */}
        <div 
          onClick={() => setExpandedTier(expandedTier === 'noise' ? null : 'noise')}
          className={`flex-1 bg-slate-50/70 hover:bg-slate-100/70 rounded-t-xl relative cursor-pointer border-b border-slate-200 group transition-all p-0.5 h-full flex flex-col justify-end items-center ${expandedTier === 'noise' ? 'ring-2 ring-blue-300' : ''}`}
        >
          <div 
            className="w-full bg-blue-300 rounded-t-md transition-all duration-1000 ease-out"
            style={{ height: `${heights.noise}%` }}
          ></div>
          
          <div className="absolute top-2 left-0 right-0 flex flex-col items-center text-center">
            <span className="text-[9px] font-bold text-slate-400 group-hover:text-blue-400 tracking-wider uppercase">Noise</span>
            <span className="text-xs font-black text-blue-400 mt-0.5">{heights.noise}%</span>
          </div>
        </div>
      </div>

      {/* Expanded Drill-Down list */}
      {expandedTier && (
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-3 animate-fade-in-up">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-[9px] font-black text-slate-700 uppercase tracking-wider">
              {expandedTier === 'tier1' && 'Tier 1 Breakdown'}
              {expandedTier === 'tier2' && 'Tier 2 Breakdown'}
              {expandedTier === 'noise' && 'Social Noise Breakdown'}
            </h4>
            <button 
              onClick={() => setExpandedTier(null)}
              className="text-[10px] text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1">
            {(expandedTier === 'tier1' ? tier1Details : expandedTier === 'tier2' ? tier2Details : noiseDetails).map((item, idx) => (
              <div key={idx} className="bg-white p-1.5 rounded-lg border border-slate-150 flex items-center justify-between text-[10px] hover:border-slate-300 transition-colors">
                <div>
                  <span className="font-bold text-slate-800">{item.source}</span>
                  <span className="text-[9px] text-slate-400 ml-1.5">{item.reach}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {getSentimentBadge(item.sentiment)}
                  <span className="font-bold text-slate-700">{item.impactScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Stream Ticker */}
      <div className="border-t border-slate-100 pt-3">
        <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Live Media Feed</h4>
        <div className="space-y-2 max-h-[90px] overflow-y-auto pr-1">
          {liveStories.map((story) => (
            <div key={story.id} className="p-2 bg-slate-50/50 rounded-lg border border-slate-100 flex items-start gap-2 text-[10px]">
              <span className={`text-[8px] font-mono font-black px-1.5 py-0.5 rounded flex-shrink-0 uppercase tracking-wider ${
                story.tier === 'Tier 1' 
                  ? 'bg-slate-800 text-white' 
                  : story.tier === 'Tier 2' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-100 text-blue-700'
              }`}>
                {story.tier}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-slate-700 font-semibold truncate leading-tight">{story.text}</p>
                <div className="flex items-center justify-between mt-1 text-[8px] text-slate-400">
                  <span>{story.time}</span>
                  <span className={story.type === 'pos' ? 'text-emerald-600' : story.type === 'neg' ? 'text-rose-600' : 'text-slate-500'}>
                    {story.type === 'pos' ? 'Positive' : story.type === 'neg' ? 'Risk' : 'Neutral'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

