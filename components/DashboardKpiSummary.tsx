import React from 'react';
import { Zap, TrendingUp, AlertCircle, BarChart3, ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react';

interface KpiCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: string;
    trendType?: 'positive' | 'negative' | 'neutral' | 'critical';
    color: string;
    borderColor: string;
    onClick?: () => void;
}

const KpiCard: React.FC<KpiCardProps> = ({ 
    title, 
    value, 
    icon, 
    trend, 
    trendType = 'neutral', 
    color, 
    borderColor, 
    onClick 
}) => {
    const getTrendClass = () => {
        switch (trendType) {
            case 'positive': return 'text-emerald-700 bg-emerald-500/10 border border-emerald-500/20';
            case 'negative': return 'text-rose-700 bg-rose-500/10 border border-rose-500/20';
            case 'critical': return 'text-amber-800 bg-amber-500/10 border border-amber-500/20 animate-pulse';
            default: return 'text-slate-600 bg-slate-500/10 border border-slate-500/20';
        }
    };

    return (
        <div 
            onClick={onClick}
            className={`bg-white/70 backdrop-blur-md p-5 rounded-xl border-l-4 ${borderColor} border-t border-b border-r border-slate-200/50 flex flex-col justify-between cursor-pointer shadow-[0_8px_32px_0_rgba(15,23,42,0.03)] hover:shadow-[0_20px_50px_rgba(15,23,42,0.06)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 group`}
        >
            <div className="flex items-start justify-between w-full mb-3">
                <div>
                    <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-sans">
                        {title}
                    </p>
                    <p className="text-2xl font-extrabold text-slate-850 mt-1 tracking-tight group-hover:text-blue-600 transition-colors duration-200">
                        {value}
                    </p>
                </div>
                <div className={`p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 ${color}`}>
                    {icon}
                </div>
            </div>
            
            {trend && (
                <div className="flex items-center mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-wider ${getTrendClass()}`}>
                        {trendType === 'positive' && <ArrowUpRight size={12} />}
                        {trendType === 'negative' && <ArrowDownRight size={12} />}
                        {trend}
                    </span>
                </div>
            )}
        </div>
    );
};

export const DashboardKpiSummary: React.FC<{ data: any }> = ({ data }) => {
    // Dynamic parsing of market pulse status from actual dailyBriefing content
    const getMarketPulseStatus = (content?: string) => {
        if (!content) return "Resurgent";
        const text = content.toLowerCase();
        if (text.includes("resurgence") || text.includes("growth") || text.includes("boom") || text.includes("positive")) {
            return "Resurgent";
        }
        if (text.includes("sensitive") || text.includes("fluctuate") || text.includes("tax") || text.includes("sst")) {
            return "Sensitive";
        }
        if (text.includes("crisis") || text.includes("drop") || text.includes("decline") || text.includes("volatile")) {
            return "Volatile";
        }
        return "Stable";
    };

    const pulseStatus = getMarketPulseStatus(data.dailyBriefing?.marketPulse?.content);
    const criticalRisksCount = data.contentRisks?.filter((r: any) => r.threatLevel === 'Critical').length || 0;
    const proactiveActionsCount = data.proactiveActions?.length || 0;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-fade-in-up">
            <KpiCard 
                title="Proactive Actions" 
                value={proactiveActionsCount > 0 ? `${proactiveActionsCount} Suggested` : "0 Pending"} 
                icon={<Zap size={18} />} 
                color="bg-amber-500/10 text-amber-600 border border-amber-500/20" 
                borderColor="border-l-amber-500"
                trend={proactiveActionsCount > 0 ? "AI Recommendations Ready" : "All Clear"}
                trendType={proactiveActionsCount > 0 ? "critical" : "neutral"}
            />
            <KpiCard 
                title="Market Pulse" 
                value={pulseStatus} 
                icon={<TrendingUp size={18} />} 
                color="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
                borderColor="border-l-emerald-500"
                trend="+2.4% Momentum" 
                trendType="positive"
            />
            <KpiCard 
                title="Sentiment Score" 
                value="78 / 100" 
                icon={<BarChart3 size={18} />} 
                color="bg-blue-500/10 text-blue-600 border border-blue-500/20" 
                borderColor="border-l-blue-500"
                trend="Improving Narrative" 
                trendType="positive"
            />
            <KpiCard 
                title="Critical Alerts" 
                value={criticalRisksCount > 0 ? `${criticalRisksCount} Active` : "0 Active"} 
                icon={criticalRisksCount > 0 ? <AlertCircle size={18} className="animate-bounce" /> : <ShieldCheck size={18} />} 
                color={criticalRisksCount > 0 ? "bg-rose-500/10 text-rose-600 border border-rose-500/20" : "bg-teal-500/10 text-teal-600 border border-teal-500/20"} 
                borderColor={criticalRisksCount > 0 ? "border-l-rose-500" : "border-l-teal-500"}
                trend={criticalRisksCount > 0 ? "Action Required" : "Secure System State"}
                trendType={criticalRisksCount > 0 ? "negative" : "positive"}
            />
        </div>
    );
};

