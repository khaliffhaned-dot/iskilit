import * as React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import { generateCampaignHubPlan, generateCampaignContent } from '../../services/aiService.ts';
import { CampaignHubReport, CampaignCalendarItem, User, Workspace } from '../../types.ts';
import { exportElementAsPDF } from '../../services/exportService.ts';

const StatCard: React.FC<{ title: string; value: string; change: number; }> = ({ title, value, change }) => {
  const isIncrease = change >= 0;
  const colorClass = isIncrease ? 'text-green-600' : 'text-red-600';
  const arrow = isIncrease ? '↑' : '↓';

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200">
      <h4 className="text-slate-500 font-medium text-sm">{title}</h4>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
      <p className={`text-xs mt-1 ${colorClass}`}>
        {arrow} {Math.abs(change)}%
      </p>
    </div>
  );
};

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border border-slate-200 rounded-lg shadow-lg">
                {payload.map((pld: any, index: number) => (
                    <p key={index} className="font-bold text-slate-700" style={{color: pld.stroke}}>
                        {`${pld.name}: ${pld.value}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const CalendarItemCard: React.FC<{item: CampaignCalendarItem}> = ({ item }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    return (
        <div className="bg-slate-50 p-4 rounded-lg flex flex-col border border-slate-200">
            <p className="font-bold text-center text-slate-500 mb-2">Day {item.day}</p>
            <div className="bg-white p-3 rounded h-full flex flex-col justify-between border border-slate-200">
                <div>
                    <p className="text-sm font-semibold text-amber-600">{item.platform}</p>
                    <p className="text-slate-800 font-bold text-sm mt-1">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                </div>
                {item.draftContent && (
                    <div className="mt-2">
                        <button onClick={() => setIsExpanded(!isExpanded)} className="text-xs text-amber-600 hover:underline print-hidden">
                            {isExpanded ? 'Hide' : 'Show'} Draft Content
                        </button>
                        {isExpanded && (
                            <p className="text-xs text-slate-600 mt-1 bg-slate-100 p-2 rounded whitespace-pre-wrap">{item.draftContent}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

interface CampaignPlannerProps {
    activeWorkspace: Workspace;
    currentUser: User;
}

const CampaignPlanner: React.FC<CampaignPlannerProps> = ({ activeWorkspace, currentUser }) => {
    const [goal, setGoal] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isGeneratingContent, setIsGeneratingContent] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [report, setReport] = React.useState<CampaignHubReport | null>(null);
    const [isExporting, setIsExporting] = React.useState(false);

    const handleGeneratePlan = React.useCallback(async () => {
        if (!goal.trim()) return;
        setIsLoading(true);
        setError(null);
        setReport(null);
        try {
            const result = await generateCampaignHubPlan(activeWorkspace.id, goal, currentUser.persona, currentUser.persona.aiEngine);
            setReport(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    }, [goal, activeWorkspace.id, currentUser]);

    const handleGenerateContent = React.useCallback(async () => {
        if (!report) return;
        setIsGeneratingContent(true);
        try {
            const updatedReport = await generateCampaignContent(activeWorkspace.id, report, currentUser.persona, currentUser.persona.aiEngine);
            setReport(updatedReport);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred while generating content');
        } finally {
            setIsGeneratingContent(false);
        }
    }, [report, activeWorkspace.id, currentUser]);
    
    const handleExportPdf = async () => {
        if (isExporting || !report) return;
        setIsExporting(true);
        await new Promise(resolve => setTimeout(resolve, 50));
        await exportElementAsPDF('report-content', `Escalate-Campaign-Plan-${report.plan.strategy.title.substring(0,20)}`);
        setIsExporting(false);
    };

    return (
        <div className="fade-in">
            <Header title="IMC Strategy Architect" subtitle="Transform a core objective into a complete, multi-channel Integrated Marketing Communications plan with timelines, content, and KPIs." />
            
            <Card>
                <label className="block text-sm font-medium text-slate-700 mb-4">Select or Describe a Campaign Goal</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {['Launch sustainable product line to urban millennials', 'Rebrand company image to focus on AI innovation', 'Crisis management plan for recent service outage', 'Increase market penetration in the youth demographic'].map(option => (
                        <button 
                            key={option}
                            onClick={() => setGoal(option)}
                            className={`p-3 rounded-lg border text-left transition-all ${goal === option ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-500' : 'bg-white border-slate-300 hover:border-amber-400'}`}
                        >
                            <p className="font-semibold text-slate-800">{option}</p>
                        </button>
                    ))}
                </div>
                <textarea
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    placeholder="Or describe a custom campaign goal..."
                    rows={2}
                    className="w-full bg-white border border-slate-300 rounded-lg p-4 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                 <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGeneratePlan}
                        disabled={isLoading || !goal.trim()}
                        className="btn btn-primary"
                    >
                        {isLoading ? 'Generating Plan...' : 'Generate AI Campaign Plan'}
                    </button>
                </div>
            </Card>

            {isLoading && <div className="py-20"><LoadingSpinner /></div>}
            {error && <p className="text-center text-red-600 mt-8">{error}</p>}

            {report && !isLoading && (
                <div id="report-content" className="mt-8 space-y-6 fade-in">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-slate-800">{report.plan.strategy.title}</h2>
                        <button onClick={handleExportPdf} disabled={isExporting} className="btn btn-secondary print-hidden">
                            {isExporting ? 'Saving...' : 'Save as PDF'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card title="Core Strategy" className="lg:col-span-2 card-color-1">
                            <p><strong className="font-semibold text-slate-800">Target Audience:</strong> {report.plan.strategy.targetAudience}</p>
                            <p><strong className="font-semibold text-slate-800">Core Message:</strong> {report.plan.strategy.coreMessage}</p>
                        </Card>
                         <Card title="Google Ads Integration" className="card-color-2">
                            <p className="text-sm text-slate-500 mb-3">Sync campaign performance data from your Google Ads account.</p>
                            <button className="w-full btn btn-secondary">Connect Google Ads</button>
                        </Card>
                    </div>

                    <Card className="card-color-3">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Content Calendar</h3>
                            <button onClick={handleGenerateContent} disabled={isGeneratingContent} className="btn btn-secondary print-hidden">
                                {isGeneratingContent ? 'Generating...' : 'Generate All Draft Content'}
                            </button>
                        </div>
                         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                            {(report.plan.contentCalendar || []).map((item, index) => (
                                <CalendarItemCard key={index} item={item} />
                            ))}
                        </div>
                    </Card>

                    <Card title="Performance Projections" className="card-color-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {(report.plan.performanceReport.metrics || []).map((metric, i) => (
                                <StatCard key={i} title={metric.kpi} value={metric.value} change={metric.change} />
                            ))}
                        </div>
                        <h4 className="font-semibold text-center text-slate-600 mb-2">Projected Engagement Over 7 Days</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={report.plan.performanceReport.engagementProjection}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="day" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="engagement" stroke="#f59e0b" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default CampaignPlanner;