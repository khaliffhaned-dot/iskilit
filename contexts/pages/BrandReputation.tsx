import * as React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import { generateBrandReputationReport } from '../../services/aiService.ts';
import { BrandReputationReport, ReputationKeyFinding, User, Workspace } from '../../types.ts';
import ReputationGauge from '../../components/charts/ReputationGauge.tsx';
import EmptyState from '../../components/EmptyState.tsx';
import { exportElementAsPDF } from '../../services/exportService.ts';
import CommentThread from '../../components/CommentThread.tsx';
import * as cloudService from '../../services/cloudService.ts';

interface BrandReputationProps {
    activeWorkspace: Workspace;
    currentUser: User;
}

const ImpactIndicator: React.FC<{ level: 'High' | 'Medium' | 'Low' }> = ({ level }) => {
    const styles = {
        High: 'bg-red-500/20 text-red-700',
        Medium: 'bg-yellow-500/20 text-yellow-700',
        Low: 'bg-green-500/20 text-green-700',
    };
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[level]}`}>{level} Impact</span>;
}

const FindingCard: React.FC<{ finding: ReputationKeyFinding }> = ({ finding }) => {
    const styles = {
        Positive: { 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            bg: 'bg-green-500/10',
        },
        Negative: { 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            bg: 'bg-red-500/10',
        },
        Opportunity: { 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
            bg: 'bg-amber-500/10',
        },
    };

    const currentStyle = styles[finding.type];

    return (
        <div className={`p-4 rounded-lg flex items-start gap-4 ${currentStyle.bg}`}>
            <div className="flex-shrink-0">{currentStyle.icon}</div>
            <div className="flex-grow">
                <p className="text-slate-700">{finding.description}</p>
                <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-semibold">Source: {finding.source}</span>
                    <ImpactIndicator level={finding.impact} />
                </div>
            </div>
        </div>
    );
};

const BrandReputation: React.FC<BrandReputationProps> = ({ activeWorkspace, currentUser }) => {
    const [brandName, setBrandName] = React.useState(activeWorkspace.brandName);
    const [report, setReport] = React.useState<BrandReputationReport | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [isExporting, setIsExporting] = React.useState(false);

    const handleAnalyze = React.useCallback(async (forceRefresh = false) => {
        if (!brandName.trim()) {
            setError('Please enter a brand name to analyze.');
            return;
        }
        if (forceRefresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }
        setError(null);
        if (!forceRefresh) {
            setReport(null);
        }

        try {
            const result = await generateBrandReputationReport(activeWorkspace.id, brandName, { forceRefresh }, currentUser.persona, currentUser.persona.aiEngine);
            setReport(result);
        } catch (e) {
            setError('An error occurred while generating the report. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [brandName, activeWorkspace.id, currentUser]);

    const handleExportPdf = async () => {
        if (!report || isExporting) return;
        setIsExporting(true);
        const fileName = `Brand_Reputation_${brandName}_${new Date().toISOString().split('T')[0]}`;
        await exportElementAsPDF('report-content', fileName);
        setIsExporting(false);
    };

    const chartStyles = React.useMemo(() => ({
        axisColor: '#64748b',
        gridColor: '#e2e8f0',
        tooltip: {
            contentStyle: {
                backgroundColor: '#ffffff',
                border: `1px solid #e2e8f0`
            },
            cursor: { fill: 'rgba(0,0,0,0.05)' }
        }
    }), []);
    
    const renderReport = () => {
        if (!report) return null;
        return (
            <div className="mt-8 space-y-8 fade-in" id="report-content">
                <Card>
                    <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                        <h3 className="text-xl font-bold text-slate-800">Reputation Report for "{report.brandName}"</h3>
                        <div className="flex items-center gap-2 print-hidden">
                            <button onClick={() => handleAnalyze(true)} disabled={isLoading || isRefreshing} className="btn btn-secondary">
                                {isRefreshing ? 'Refreshing...' : 'Refresh'}
                            </button>
                            <button onClick={handleExportPdf} disabled={isExporting} className="btn btn-secondary">
                                {isExporting ? 'Saving...' : 'Save as PDF'}
                            </button>
                        </div>
                    </div>
                    <p className="text-slate-500 mb-6">{report.summary}</p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <ReputationGauge score={report.reputationScore} theme={'light'} />
                        </div>
                        <div className="lg:col-span-2">
                            <h4 className="text-lg font-semibold text-slate-700 mb-2 text-center">Sentiment Trend (Last 7 Days)</h4>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={report.sentimentTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.gridColor} />
                                    <XAxis dataKey="day" stroke={chartStyles.axisColor} tick={{fontSize: 12}} />
                                    <YAxis stroke={chartStyles.axisColor} domain={[0, 100]} />
                                    <Tooltip {...chartStyles.tooltip} />
                                    <Line type="monotone" dataKey="score" name="Score" stroke="#f59e0b" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>

                <Card title="Key Reputation Metrics" className="card-color-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(report.metrics || []).map(metric => (
                            <div key={metric.name} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="font-semibold text-amber-600">{metric.name}</p>
                                <p className="text-2xl font-bold text-slate-800">{metric.value}</p>
                                <p className="text-xs text-slate-500">{metric.explanation}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Key Findings" className="card-color-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {(report.keyFindings || []).map((finding, i) => <FindingCard key={i} finding={finding} />)}
                    </div>
                </Card>
                
                <Card title="Strategic Recommendations" className="card-color-6">
                    <ul className="list-disc list-inside space-y-2 text-slate-600">
                        {(report.strategicRecommendations || []).map((rec, i) => <li key={i}>{rec}</li>)}
                    </ul>
                </Card>
                 <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-400 flex justify-between items-center">
                    <span>Generated: {new Date(report.timestamp).toLocaleString()}</span>
                    <span className="font-semibold text-slate-500">Source: Escalate AI</span>
                </div>
            </div>
        )
    };
    
    return (
        <div className="fade-in">
            <Header title="Live Reputation Pulse" subtitle="Go beyond media monitoring with a live, 360-degree view of brand perception, powered by continuous data synthesis and AI analysis."/>
            <Card>
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="Enter brand name to analyze..."
                        className="flex-grow w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-800"
                        disabled={isLoading || isRefreshing}
                    />
                    <button
                        onClick={() => handleAnalyze(false)}
                        disabled={isLoading || isRefreshing}
                        className="btn btn-primary w-full sm:w-auto flex-shrink-0"
                    >
                        {isLoading ? 'Analyzing...' : (isRefreshing ? 'Refreshing...' : 'Analyze Reputation')}
                    </button>
                </div>
            </Card>

            {isLoading && <div className="py-20"><LoadingSpinner /></div>}
            {error && <Card className="mt-8"><p className="text-center text-red-600 py-4">{error}</p></Card>}
            
            {!isLoading && report && (
                <>
                    {renderReport()}
                    {report.id && (
                        <CommentThread
                            reportId={report.id}
                            currentUser={currentUser}
                            onPostComment={cloudService.postComment}
                        />
                    )}
                </>
            )}

            {!isLoading && !report && !error && (
                <EmptyState
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-slate-400" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l5.5-5.5a1 1 0 011.414 0l5.5 5.5A12.02 12.02 0 0021 8.984a11.955 11.955 0 01-2.382-5.000z" /></svg>}
                    title="Analyze Brand Reputation"
                    message="Enter a brand name to generate a live, 360-degree view of its public perception."
                />
            )}
        </div>
    );
};

export default BrandReputation;