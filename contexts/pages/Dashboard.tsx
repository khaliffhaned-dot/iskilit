import * as React from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/Header.tsx';
import { fetchAnalyticsDashboardData } from '../../services/aiService.ts';
import { AnalyticsDashboardData, ActivePage, ProactiveAction, Workspace, User } from '../../types.ts';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import Card from '../../components/Card.tsx';
import PerceptionRadarChart from '../../components/charts/PerceptionRadarChart.tsx';
import { DashboardKpiSummary } from '../../components/DashboardKpiSummary.tsx';
import { RecentAlerts } from '../../components/RecentAlerts.tsx';
import { SOVTracker } from '../../components/SOVTracker.tsx';
import { MalaysiaMap } from '../../components/MalaysiaMap.tsx';
import { ExecutiveSnapshot } from '../../components/ExecutiveSnapshot.tsx';
import SentimentTrendline from '../../components/SentimentTrendline.tsx';
import { SocialListeningModule } from '../../components/SocialListeningModule.tsx';
import { KeyMessagePenetration } from '../../components/KeyMessagePenetration.tsx';
import { ActiveStrategicInitiatives } from '../../components/ActiveStrategicInitiatives.tsx';
import { MediaTierResonance } from '../../components/MediaTierResonance.tsx';
import { PredictiveEvents } from '../../components/PredictiveEvents.tsx';
import { StakeholderMapping } from '../../components/StakeholderMapping.tsx';

interface DashboardProps {
  setActivePage: (pageState: ActivePage) => void;
  activeWorkspace: Workspace;
  currentUser: User;
}

const ProactiveActionCard: React.FC<{ action: ProactiveAction; onExecute: (action: ProactiveAction) => void; }> = ({ action, onExecute }) => (
    <Card className="flex flex-col h-full !bg-white/40 backdrop-blur-sm border-slate-200/50">
        <h4 className="text-lg font-bold text-amber-600">{action.title}</h4>
        <p className="text-slate-600 mt-2 flex-grow">{action.recommendation}</p>
        <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 bg-slate-200 px-2 py-1 rounded-full">Suggested Tool: {action.suggestedPage}</span>
            <button
                onClick={() => onExecute(action)}
                className="btn btn-primary text-sm"
            >
                Execute with AI
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </button>
        </div>
    </Card>
);


const Dashboard: React.FC<DashboardProps> = ({ setActivePage, activeWorkspace, currentUser }) => {
    const [data, setData] = React.useState<AnalyticsDashboardData | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [time, setTime] = React.useState(new Date());
    const [isCrisisMode, setIsCrisisMode] = React.useState(false);

    React.useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);
    
    const loadData = React.useCallback(async (forceRefresh = false) => {
        setError(null);
        setIsLoading(true);
        try {
            const result = await fetchAnalyticsDashboardData(activeWorkspace.id, { 
                brandName: activeWorkspace.brandName,
                competitors: activeWorkspace.competitors
            }, currentUser.persona, currentUser.persona.aiEngine);
            if (result) {
                setData(result as AnalyticsDashboardData);
            } else {
                setError("Failed to fetch live dashboard data for this workspace. The AI service may be unavailable.");
            }
        } catch (err) {
            setError("An error occurred while fetching dashboard data.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [activeWorkspace, currentUser]);
    
    React.useEffect(() => {
        loadData();
    }, [loadData]);

    const handleExecuteAction = (action: ProactiveAction) => {
        setActivePage({
            page: action.suggestedPage,
            payload: action,
        });
    };
    
    if (isLoading) return <div className="py-20"><LoadingSpinner /></div>;
    if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
    if (!data) return null;

    return (
        <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-200 pb-4 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">C-Suite Narrative Briefing</h1>
                <p className="text-slate-500 text-sm mt-1">Your real-time, high-level overview of the narrative landscape for {activeWorkspace.brandName}.</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mt-2 md:mt-0">
                {/* DEFCON / Crisis Toggle Button */}
                <button 
                    onClick={() => setIsCrisisMode(!isCrisisMode)}
                    className={`px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-sm ${isCrisisMode ? 'bg-red-600 text-white animate-pulse' : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50'}`}
                >
                    {isCrisisMode ? '🚨 CRISIS MODE ACTIVE' : 'Peace Time Mode'}
                </button>

                {/* Animated Pulsing Status Badge */}
                <div className="flex items-center space-x-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 shadow-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                  <span className="text-amber-700 text-xs font-semibold tracking-wide uppercase">Simulated AI Engine</span>
                </div>

                {/* Time Range Selector */}
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                    {['24H', '7D', '30D'].map(t => (
                        <button key={t} className={`px-2.5 py-1 text-xs font-bold rounded-md ${t === '7D' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{t}</button>
                    ))}
                    <button className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100 border-l border-slate-200 ml-1">Export PDF</button>
                </div>
                
                {/* Live Ticking Clock */}
                <div className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
                  {time.toLocaleString('en-MY', { 
                    dateStyle: 'short', 
                    timeStyle: 'medium',
                    hour12: true 
                  })}
                </div>
              </div>
            </div>
            
            <ExecutiveSnapshot summary={`Sentiment is stabilizing at 78/100 following the ${activeWorkspace.brandName} rollout. However, a potential regulatory review (85% probability) threatens Q3 narrative positioning. Recommended focus: Pre-emptive ESG messaging.`} />
            
            <DashboardKpiSummary data={data} />

            {/* Row 1: Core Perception & Market Analytics (3-Column balanced grid in peacetime, Geospatial Map in crisis) */}
            <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="w-full animate-fade-in-up">
                    <SentimentTrendline />
                </div>

                {!isCrisisMode ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-100">
                        <Card 
                            title="Brand Perception Radar" 
                            className="card-color-1 h-[460px] flex flex-col justify-between"
                            titleClassName="!text-sm !font-bold !tracking-wider !text-slate-500 !uppercase !mb-4"
                        >
                            <PerceptionRadarChart 
                                data={data.brandPerception || []}
                                brands={[activeWorkspace.brandName, ...activeWorkspace.competitors]}
                            />
                        </Card>
                        <SOVTracker className="h-[460px]" />
                        <SocialListeningModule className="h-[460px]" />
                    </div>
                ) : (
                    <div className="w-full animate-fade-in-up delay-100 bg-rose-50/50 p-4 rounded-3xl border border-rose-100">
                        <MalaysiaMap isCrisisMode={isCrisisMode} className="w-full" />
                    </div>
                )}

                {/* Row 2: Strategic Insights & Narrative Protection (2-Column asymmetric but uniform grid) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-in-up delay-150">
                        <RecentAlerts alerts={data.contentRisks || []} className="h-[440px]" />
                        <MediaTierResonance className="h-[440px]" />
                    </div>
                    <div className="lg:col-span-5 flex flex-col gap-6 animate-fade-in-up delay-200">
                        <KeyMessagePenetration className="h-[440px]" />
                        <ActiveStrategicInitiatives className="h-[440px]" />
                    </div>
                </div>
            </motion.div>

            {!isCrisisMode && data.proactiveActions && data.proactiveActions.length > 0 && (
                <Card className="card-color-3">
                        <h3 className="text-xl font-bold text-slate-800">Proactive Strategic Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {data.proactiveActions.map((action, index) => (
                            <ProactiveActionCard key={index} action={action} onExecute={handleExecuteAction} />
                        ))}
                        </div>
                </Card>
            )}
        </motion.div>
    );
};

export default Dashboard;
