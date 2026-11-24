import React, { useState, useMemo } from 'react';
import Card from './Card';
import { 
    MapPin, 
    TrendingUp, 
    TrendingDown,
    AlertTriangle, 
    CheckCircle2, 
    Activity, 
    ShieldAlert, 
    Users, 
    Radio, 
    Search, 
    Globe,
    Info,
    RefreshCw
} from 'lucide-react';

// Define the interface for a region's dataset
interface RegionData {
    id: string;
    name: string;
    x: number; // SVG X coordinate
    y: number; // SVG Y coordinate
    normalMentions: number;
    crisisMentions: number;
    normalSentiment: { positive: number; neutral: number; negative: number };
    crisisSentiment: { positive: number; neutral: number; negative: number };
    normalNarrative: string;
    crisisNarrative: string;
    normalChannel: string;
    crisisChannel: string;
    normalRecommendation: string;
    crisisRecommendation: string;
    type: 'media' | 'crisis' | 'stakeholder' | 'all';
}

interface MalaysiaMapProps {
    isCrisisMode: boolean;
    className?: string;
    showDetailsPanel?: boolean;
}

export const MalaysiaMap: React.FC<MalaysiaMapProps> = ({ 
    isCrisisMode, 
    className = '',
    showDetailsPanel = true 
}) => {
    // Initial datasets for Malaysia regions under normal and crisis modes
    const regions: RegionData[] = [
        {
            id: 'kl_selangor',
            name: 'Kuala Lumpur & Selangor (Central)',
            x: 235,
            y: 250,
            normalMentions: 14250,
            crisisMentions: 89400,
            normalSentiment: { positive: 58, neutral: 28, negative: 14 },
            crisisSentiment: { positive: 6, neutral: 12, negative: 82 },
            normalNarrative: 'Digital Hub Infrastructure & Fintech Initiatives',
            crisisNarrative: 'Viral Boycott Propagation & Supply Chain Backlash',
            normalChannel: 'The Star Online, Astro Awani',
            crisisChannel: 'Twitter/X Microblog Networks, TikTok Alerts',
            normalRecommendation: 'Boost visibility on fintech advancements using targeted PR campaigns.',
            crisisRecommendation: 'Deploy verified environmental and payroll audits directly via high-authority press agencies immediately to counter algorithmic spread.',
            type: 'all'
        },
        {
            id: 'penang',
            name: 'Penang (Northern Semiconductor Corridor)',
            x: 195,
            y: 150,
            normalMentions: 6840,
            crisisMentions: 12400,
            normalSentiment: { positive: 74, neutral: 18, negative: 8 },
            crisisSentiment: { positive: 45, neutral: 35, negative: 20 },
            normalNarrative: 'Silicon Shield Expansion & Global Tech Talent',
            crisisNarrative: 'Industrial Plant Security Fears & Spillover Labor Gossip',
            normalChannel: 'Penang Biz News, BFM 89.9',
            crisisChannel: 'Hardware Forum Malaysia, Local Facebook Groups',
            normalRecommendation: 'Coordinate joint media events with multinational partners.',
            crisisRecommendation: 'Reassure local stakeholders with a transparent factory safety roadmap and verified work condition reports.',
            type: 'media'
        },
        {
            id: 'johor',
            name: 'Johor (Southern Economic Hub)',
            x: 275,
            y: 310,
            normalMentions: 5120,
            crisisMentions: 16800,
            normalSentiment: { positive: 64, neutral: 26, negative: 10 },
            crisisSentiment: { positive: 30, neutral: 28, negative: 42 },
            normalNarrative: 'Cross-Border Special Economic Zone & Green Transit',
            crisisNarrative: 'Cross-Border Smuggling Allegations & Logistics Delays',
            normalChannel: 'Johor Press, Straits Times',
            crisisChannel: 'Southern Telegram Hubs, WhatsApp Broadcast Alerts',
            normalRecommendation: 'Emphasize bilateral trade benefits and green infrastructure milestones.',
            crisisRecommendation: 'Deploy on-ground factual representatives to checkpoints and publish live logistics telemetry dashboards.',
            type: 'stakeholder'
        },
        {
            id: 'east_coast',
            name: 'Pahang & Kelantan (East Coast)',
            x: 245,
            y: 190,
            normalMentions: 2980,
            crisisMentions: 5800,
            normalSentiment: { positive: 45, neutral: 42, negative: 13 },
            crisisSentiment: { positive: 22, neutral: 40, negative: 38 },
            normalNarrative: 'Eco-Tourism Promotion & Traditional Craft Preservation',
            crisisNarrative: 'Ecotourism Corporate Encroachment Activism',
            normalChannel: 'Sinar Harian, Pahang Post',
            crisisChannel: 'Local Environmental Activists, Regional TikTok Creators',
            normalRecommendation: 'Promote community-led sustainability and indigenous engagement projects.',
            crisisRecommendation: 'Halt work in sensitive sectors and hold town halls with local community councils to address concerns directly.',
            type: 'media'
        },
        {
            id: 'sarawak',
            name: 'Sarawak (Green Hydrogen Initiative)',
            x: 520,
            y: 255,
            normalMentions: 4350,
            crisisMentions: 8900,
            normalSentiment: { positive: 82, neutral: 13, negative: 5 },
            crisisSentiment: { positive: 60, neutral: 25, negative: 15 },
            normalNarrative: 'State-backed Clean Energy Leadership & Hydropower Exports',
            crisisNarrative: 'Clean Energy Project Cost Overruns & Local Resettlement Complaints',
            normalChannel: 'Borneo Post, Dayak Daily',
            crisisChannel: 'East Malaysia Forums, Local Environmental Coalitions',
            normalRecommendation: 'Highlight positive socioeconomic reports from newly powered zones.',
            crisisRecommendation: 'Publish complete carbon balance studies and transparent compensation/resettlement data files.',
            type: 'stakeholder'
        },
        {
            id: 'sabah',
            name: 'Sabah (Maritime Transit Corridor)',
            x: 695,
            y: 175,
            normalMentions: 3100,
            crisisMentions: 7400,
            normalSentiment: { positive: 69, neutral: 21, negative: 10 },
            crisisSentiment: { positive: 48, neutral: 32, negative: 20 },
            normalNarrative: 'Deepwater Port Commercial Growth & Maritime Security',
            crisisNarrative: 'Territorial Dispute Disinformation & Piracy Narrative Spikes',
            normalChannel: 'Daily Express Sabah, Borneo Today',
            crisisChannel: 'Regional Telegram Alerts, Defense Blogs Malaysia',
            normalRecommendation: 'Promote active naval patrols and investment safety figures.',
            crisisRecommendation: 'Coordinate with maritime authority security statements and issue fact-checks within hours of rumors.',
            type: 'media'
        }
    ];

    const [selectedRegionId, setSelectedRegionId] = useState<string>('kl_selangor');
    const [activeLayer, setActiveLayer] = useState<'all' | 'media' | 'crisis' | 'stakeholder'>('all');
    const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Filter regions based on layer selection
    const filteredRegions = useMemo(() => {
        return regions.filter(r => {
            if (activeLayer === 'all') return true;
            if (activeLayer === 'media' && r.type === 'media') return true;
            if (activeLayer === 'crisis' && isCrisisMode) return true; // everything can be a crisis under crisis mode
            if (activeLayer === 'stakeholder' && r.type === 'stakeholder') return true;
            return r.type === activeLayer || r.type === 'all';
        });
    }, [activeLayer, isCrisisMode]);

    // Handle searching
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const found = regions.find(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));
        if (found) {
            setSelectedRegionId(found.id);
            setSearchQuery('');
        }
    };

    // Find current selected region data
    const activeRegion = useMemo(() => {
        return regions.find(r => r.id === selectedRegionId) || regions[0];
    }, [selectedRegionId, isCrisisMode]);

    const activeSentiment = isCrisisMode ? activeRegion.crisisSentiment : activeRegion.normalSentiment;
    const activeMentions = isCrisisMode ? activeRegion.crisisMentions : activeRegion.normalMentions;
    const activeNarrative = isCrisisMode ? activeRegion.crisisNarrative : activeRegion.normalNarrative;
    const activeChannel = isCrisisMode ? activeRegion.crisisChannel : activeRegion.normalChannel;
    const activeRecommendation = isCrisisMode ? activeRegion.crisisRecommendation : activeRegion.normalRecommendation;

    // National total summary calculated on current mode
    const nationalTotals = useMemo(() => {
        let totalMentions = 0;
        let weightedSentimentSum = 0;
        regions.forEach(r => {
            const mentions = isCrisisMode ? r.crisisMentions : r.normalMentions;
            const sent = isCrisisMode ? r.crisisSentiment : r.normalSentiment;
            totalMentions += mentions;
            weightedSentimentSum += (sent.positive - sent.negative) * mentions;
        });
        const score = Math.round((weightedSentimentSum / totalMentions + 100) / 2); // Map to 0-100 scale
        return { mentions: totalMentions, sentimentScore: score };
    }, [isCrisisMode]);

    return (
        <Card 
            title="Geospatial Reputation & Sourcing Cartography" 
            className={`card-color-4 ${className} border-slate-200 shadow-lg`}
        >
            {/* Top Stat Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
                        <Globe className="w-5 h-5 animate-spin-slow" />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Listening Coverage</div>
                        <div className="text-sm font-extrabold text-slate-700">Malaysia (6 Regions)</div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isCrisisMode ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">National Mentions (7D)</div>
                        <div className="text-sm font-extrabold text-slate-800">
                            {nationalTotals.mentions.toLocaleString()}
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isCrisisMode ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                        {isCrisisMode ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Brand Health</div>
                        <div className="text-sm font-extrabold text-slate-800 flex items-center space-x-1.5">
                            <span>{nationalTotals.sentimentScore}/100</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isCrisisMode ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {isCrisisMode ? 'CRISIS RISK' : 'HEALTHY'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick layer selector + Search row */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 mb-4">
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 self-start">
                    {(['all', 'media', 'crisis', 'stakeholder'] as const).map(layer => {
                        const isLayerActive = activeLayer === layer;
                        return (
                            <button
                                key={layer}
                                onClick={() => setActiveLayer(layer)}
                                className={`px-2.5 py-1 text-xs font-bold rounded-md capitalize transition-all ${
                                    isLayerActive 
                                        ? 'bg-white text-slate-800 shadow-sm border border-slate-200' 
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                }`}
                            >
                                {layer === 'all' ? 'All Data' : layer === 'crisis' ? '🚨 Crisis Centers' : layer}
                            </button>
                        );
                    })}
                </div>

                <form onSubmit={handleSearch} className="flex items-center bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm max-w-sm">
                    <div className="pl-3 text-slate-400">
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search state or region..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-3 py-1.5 text-xs text-slate-700 focus:outline-none w-full bg-transparent"
                    />
                    <button type="submit" className="bg-slate-800 text-white px-3 py-1.5 text-xs font-bold hover:bg-slate-900 transition-colors">
                        Go
                    </button>
                </form>
            </div>

            {/* Main Interactive Workspace Area */}
            <div className="flex flex-col lg:flex-row gap-6 items-stretch min-h-[420px]">
                {/* Left Side: Dynamic SVG Vector Map */}
                <div className="flex-1 bg-slate-900 rounded-2xl relative border border-slate-800 p-4 flex flex-col justify-between overflow-hidden shadow-inner select-none">
                    {/* Map Watermark / Title */}
                    <div className="absolute top-4 left-4 z-10 pointer-events-none">
                        <span className="text-[10px] font-mono font-bold text-slate-500 tracking-widest block uppercase">Interactive Geographic Visualizer</span>
                        <span className="text-xs font-black text-white uppercase flex items-center gap-1">
                            {isCrisisMode && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>}
                            {isCrisisMode ? 'Crisis Sourcing Matrix' : 'Reputation Sourcing Map'}
                        </span>
                    </div>

                    {/* Outer Map Area Info Badge */}
                    {isCrisisMode && (
                        <div className="absolute top-4 right-4 z-10 bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-bold px-2 py-1 rounded-md animate-pulse flex items-center space-x-1">
                            <ShieldAlert className="w-3 h-3" />
                            <span>CRISIS MODE TRIGGERED</span>
                        </div>
                    )}

                    {/* Vector Map Canvas */}
                    <div className="w-full h-[280px] md:h-[340px] flex items-center justify-center relative mt-4">
                        <svg 
                            viewBox="0 0 800 400" 
                            className="w-full h-full max-h-[340px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all"
                        >
                            {/* Graticule/Latitude lines for professional cartography style */}
                            <line x1="20" y1="100" x2="780" y2="100" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="5,5" />
                            <line x1="20" y1="200" x2="780" y2="200" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="5,5" />
                            <line x1="20" y1="300" x2="780" y2="300" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="5,5" />
                            <text x="30" y="95" className="fill-slate-600 text-[8px] font-mono">LAT 6° N</text>
                            <text x="30" y="195" className="fill-slate-600 text-[8px] font-mono">LAT 4° N</text>
                            <text x="30" y="295" className="fill-slate-600 text-[8px] font-mono">LAT 2° N</text>

                            {/* Peninsular Malaysia (West) - Stylized Vector */}
                            <path 
                                d="M 195 100 L 225 105 L 245 130 L 255 160 L 265 200 L 282 245 L 275 285 L 250 305 L 235 305 L 215 285 L 205 255 L 195 225 L 185 195 L 185 165 L 190 125 Z" 
                                className={`transition-all duration-300 stroke-slate-700 stroke-[1.5] ${
                                    selectedRegionId === 'kl_selangor' || selectedRegionId === 'penang' || selectedRegionId === 'johor' || selectedRegionId === 'east_coast'
                                        ? 'fill-slate-800' 
                                        : 'fill-slate-850 opacity-60'
                                } hover:fill-slate-750 cursor-pointer`}
                                onClick={() => setSelectedRegionId('kl_selangor')}
                            />

                            {/* East Malaysia (Sarawak & Sabah) - Stylized Vector */}
                            <path 
                                d="M 455 245 L 485 225 L 525 215 L 565 205 L 605 195 L 645 175 L 685 155 L 715 145 L 735 165 L 745 185 L 725 205 L 695 225 L 655 245 L 625 255 L 585 265 L 545 275 L 495 270 Z" 
                                className={`transition-all duration-300 stroke-slate-700 stroke-[1.5] ${
                                    selectedRegionId === 'sarawak' || selectedRegionId === 'sabah'
                                        ? 'fill-slate-800' 
                                        : 'fill-slate-850 opacity-60'
                                } hover:fill-slate-750 cursor-pointer`}
                                onClick={() => setSelectedRegionId('sarawak')}
                            />

                            {/* Regional Connecting Links (Reputation Networks) */}
                            {isCrisisMode ? (
                                <>
                                    {/* Crisis propagation visualization links */}
                                    <line x1="235" y1="250" x2="195" y2="150" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,3" className="animate-pulse" />
                                    <line x1="235" y1="250" x2="275" y2="310" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,3" className="animate-pulse" />
                                    <line x1="235" y1="250" x2="520" y2="255" stroke="#f43f5e" strokeWidth="0.8" strokeDasharray="3,6" />
                                </>
                            ) : (
                                <>
                                    {/* Standard media networking paths */}
                                    <line x1="235" y1="250" x2="195" y2="150" stroke="#10b981" strokeWidth="1" opacity="0.3" />
                                    <line x1="235" y1="250" x2="275" y2="310" stroke="#10b981" strokeWidth="1" opacity="0.3" />
                                    <line x1="235" y1="250" x2="245" y2="190" stroke="#10b981" strokeWidth="1" opacity="0.4" />
                                </>
                            )}

                            {/* Hotspot Interactive Nodes */}
                            {filteredRegions.map((region) => {
                                const isSelected = region.id === selectedRegionId;
                                const isHovered = hoveredRegion?.id === region.id;
                                const sentiment = isCrisisMode ? region.crisisSentiment : region.normalSentiment;
                                
                                // Color based on dominant sentiment and crisis status
                                let nodeColor = '#10b981'; // Green (Positive)
                                if (isCrisisMode && region.id === 'kl_selangor') {
                                    nodeColor = '#f43f5e'; // Flashing crisis red
                                } else if (sentiment.negative > 30) {
                                    nodeColor = '#ef4444'; // Red
                                } else if (sentiment.negative > 15) {
                                    nodeColor = '#f59e0b'; // Warning Amber
                                }

                                return (
                                    <g 
                                        key={region.id}
                                        onClick={() => setSelectedRegionId(region.id)}
                                        onMouseEnter={() => setHoveredRegion(region)}
                                        onMouseLeave={() => setHoveredRegion(null)}
                                        className="cursor-pointer"
                                    >
                                        {/* Outer pulsing ring */}
                                        <circle 
                                            cx={region.x} 
                                            cy={region.y} 
                                            r={isSelected || isHovered ? 20 : 12} 
                                            fill="transparent" 
                                            stroke={nodeColor} 
                                            strokeWidth="2" 
                                            className={`${(isCrisisMode && region.id === 'kl_selangor') || isSelected ? 'animate-ping' : ''}`}
                                            opacity={isSelected ? 0.8 : 0.4}
                                        />
                                        
                                        {/* Interaction glow background */}
                                        <circle 
                                            cx={region.x} 
                                            cy={region.y} 
                                            r={isSelected || isHovered ? 12 : 8} 
                                            fill={nodeColor} 
                                            opacity={isSelected ? 0.35 : isHovered ? 0.5 : 0.2}
                                        />

                                        {/* Center solid indicator */}
                                        <circle 
                                            cx={region.x} 
                                            cy={region.y} 
                                            r={isSelected ? 6 : 4} 
                                            fill={nodeColor} 
                                            className="transition-all duration-200"
                                        />

                                        {/* Label Tag */}
                                        <text
                                            x={region.x}
                                            y={region.y - (isSelected ? 24 : 16)}
                                            textAnchor="middle"
                                            className={`fill-white font-sans text-[9px] font-black tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,1)] ${
                                                isSelected ? 'scale-110 fill-amber-400' : 'opacity-70'
                                            }`}
                                        >
                                            {region.id === 'kl_selangor' ? 'KUALA LUMPUR' : region.id === 'east_coast' ? 'EAST COAST' : region.name.split(' (')[0].toUpperCase()}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>

                        {/* Floating Tooltip inside Map container */}
                        {hoveredRegion && (
                            <div 
                                className="absolute bg-slate-950/95 border border-slate-800 text-white rounded-lg p-3 text-xs shadow-2xl z-20 pointer-events-none transition-all duration-150 max-w-xs"
                                style={{
                                    left: hoveredRegion.x < 400 ? `${(hoveredRegion.x / 800) * 100 + 4}%` : 'auto',
                                    right: hoveredRegion.x >= 400 ? `${100 - (hoveredRegion.x / 800) * 100 + 4}%` : 'auto',
                                    top: `${(hoveredRegion.y / 400) * 100 - 15}%`,
                                }}
                            >
                                <div className="font-extrabold text-slate-200 border-b border-slate-800 pb-1 mb-1.5 uppercase tracking-wider text-[10px] flex items-center justify-between">
                                    <span>{hoveredRegion.name.split(' (')[0]}</span>
                                    <span className="text-[9px] text-slate-400 font-mono">ID: {hoveredRegion.id}</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-400 font-bold">Mentions (7D):</span>
                                        <span className="font-extrabold text-white">
                                            {(isCrisisMode ? hoveredRegion.crisisMentions : hoveredRegion.normalMentions).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-400 font-bold">Health Score:</span>
                                        <span className={`font-extrabold ${
                                            (isCrisisMode ? hoveredRegion.crisisSentiment : hoveredRegion.normalSentiment).negative > 30 ? 'text-rose-400' : 'text-emerald-400'
                                        }`}>
                                            {Math.round((isCrisisMode ? hoveredRegion.crisisSentiment : hoveredRegion.normalSentiment).positive)}% Positive
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-1 italic line-clamp-1">
                                        "{isCrisisMode ? hoveredRegion.crisisNarrative : hoveredRegion.normalNarrative}"
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Scale and Indicator Legend */}
                    <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80 mt-2 text-[10px] text-slate-400 font-mono">
                        <div className="flex items-center space-x-3">
                            <span className="flex items-center space-x-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                                <span>Positive (&gt;60%)</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                                <span>Warning (30-60%)</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse"></span>
                                <span>Negative / Crisis</span>
                            </span>
                        </div>
                        <div className="hidden sm:block">Scale: Vector Projection 1:450,000</div>
                    </div>
                </div>

                {/* Right Side: Detailed Intelligence & Mitigation Panel */}
                {showDetailsPanel && (
                    <div className="w-full lg:w-80 flex flex-col justify-between border border-slate-200 bg-slate-50/50 rounded-2xl p-4 shadow-sm">
                        <div>
                            {/* Panel Header */}
                            <div className="border-b border-slate-200 pb-3 mb-4">
                                <div className="flex justify-between items-start">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Geointelligence Drawer</span>
                                    <span className="text-[10px] font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-extrabold flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-amber-600" />
                                        {activeRegion.id.toUpperCase()}
                                    </span>
                                </div>
                                <h3 className="text-sm font-black text-slate-800 mt-1 break-words">{activeRegion.name}</h3>
                            </div>

                            {/* Core Stats Row */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Local Vol.</span>
                                    <span className="text-lg font-black text-slate-800">{activeMentions.toLocaleString()}</span>
                                    <span className={`text-[9px] font-extrabold flex items-center gap-0.5 mt-0.5 ${isCrisisMode ? 'text-rose-600' : 'text-emerald-600'}`}>
                                        {isCrisisMode ? <TrendingUp className="w-3.5 h-3.5 inline" /> : <TrendingUp className="w-3.5 h-3.5 inline" />}
                                        {isCrisisMode ? '+450%' : '+12%'}
                                    </span>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Rep. Index</span>
                                    <span className={`text-lg font-black ${activeSentiment.negative > 50 ? 'text-rose-600' : activeSentiment.positive > 60 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {Math.round(activeSentiment.positive)}/100
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-bold block mt-0.5">Fav. Quotient</span>
                                </div>
                            </div>

                            {/* Sentiment Progress Bar */}
                            <div className="mb-4 bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Sentiment Breakdown</span>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 flex overflow-hidden">
                                    <div 
                                        style={{ width: `${activeSentiment.positive}%` }} 
                                        className="bg-emerald-500 h-full transition-all duration-500"
                                        title={`Positive: ${activeSentiment.positive}%`}
                                    />
                                    <div 
                                        style={{ width: `${activeSentiment.neutral}%` }} 
                                        className="bg-slate-300 h-full transition-all duration-500"
                                        title={`Neutral: ${activeSentiment.neutral}%`}
                                    />
                                    <div 
                                        style={{ width: `${activeSentiment.negative}%` }} 
                                        className="bg-rose-500 h-full transition-all duration-500 animate-pulse-slow"
                                        title={`Negative: ${activeSentiment.negative}%`}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] font-extrabold mt-1.5 text-slate-600">
                                    <span className="text-emerald-600">{activeSentiment.positive}% Pos</span>
                                    <span className="text-slate-400">{activeSentiment.neutral}% Neu</span>
                                    <span className="text-rose-600">{activeSentiment.negative}% Neg</span>
                                </div>
                            </div>

                            {/* Dominant Local Narrative */}
                            <div className="mb-4 space-y-1.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dominant Regional Narrative</span>
                                <div className={`p-3 rounded-xl border text-xs font-semibold leading-relaxed ${
                                    isCrisisMode && activeRegion.id === 'kl_selangor'
                                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                                        : 'bg-white border-slate-200 text-slate-700'
                                }`}>
                                    <div className="flex items-center gap-1 mb-1 font-black text-[10px] uppercase tracking-wider">
                                        <Radio className={`w-3.5 h-3.5 ${isCrisisMode ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`} />
                                        <span>Current Anchor Topic</span>
                                    </div>
                                    "{activeNarrative}"
                                </div>
                            </div>

                            {/* Primary Sourcing Channel */}
                            <div className="mb-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Primary Sourcing Vectors</span>
                                <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                                    <Users className="w-4 h-4 text-slate-400" />
                                    {activeChannel}
                                </span>
                            </div>
                        </div>

                        {/* AI Sourcing Recommendation Action */}
                        <div className={`mt-auto p-3 rounded-xl border text-xs leading-relaxed ${
                            isCrisisMode ? 'bg-amber-500/5 border-amber-500/20 text-slate-700' : 'bg-slate-900 border-slate-950 text-slate-300'
                        }`}>
                            <div className="flex items-center gap-1.5 mb-1.5 font-bold uppercase tracking-wider text-[10px]">
                                <ShieldAlert className={`w-4 h-4 ${isCrisisMode ? 'text-amber-500 animate-bounce' : 'text-emerald-400'}`} />
                                <span className={isCrisisMode ? 'text-amber-600' : 'text-white'}>Recommended PR Shield Action</span>
                            </div>
                            <p className="text-[11px] leading-relaxed font-medium">
                                {activeRecommendation}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};
