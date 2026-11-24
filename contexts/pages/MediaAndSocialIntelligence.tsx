

import React, { useState, useCallback } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import { fetchMediaAndSocialIntelligence } from '../../services/aiService.ts';
import { MediaAndSocialIntelligenceReport, Workspace, User, UnifiedMention } from '../../types.ts';
import EmptyState from '../../components/EmptyState.tsx';
import { exportElementAsPDF } from '../../services/exportService.ts';

interface MediaAndSocialIntelligenceProps {
    activeWorkspace: Workspace;
    currentUser: User;
}

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
        <h4 className="text-slate-500 font-medium text-sm uppercase tracking-wider">{title}</h4>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
);

const MentionCard: React.FC<{ mention: UnifiedMention }> = ({ mention }) => {
    const sentimentColor = mention.sentiment === 'Positive' ? 'border-green-500' : mention.sentiment === 'Negative' ? 'border-red-500' : 'border-slate-300';
    const isNews = mention.type === 'News';
    const title = isNews ? mention.content : mention.author; // For news, content is the headline
    const body = isNews ? mention.author : mention.content; // For news, author is the publication

    return (
        <a href={mention.url} target="_blank" rel="noopener noreferrer" className={`block p-4 bg-white rounded-lg border border-slate-200 border-l-4 hover:bg-slate-50 transition-colors ${sentimentColor}`}>
            <p className="font-bold text-slate-800">{title}</p>
            <p className="text-sm text-slate-600 mt-1">{body}</p>
            <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                <span>{mention.platform}</span>
                <span>{new Date(mention.timestamp).toLocaleDateString()}</span>
            </div>
        </a>
    )
};

const THEME_COLORS = ['#F59E0B', '#EF4444', '#10B981', '#6366F1', '#EC4899', '#64748B'];

const MediaAndSocialIntelligence: React.FC<MediaAndSocialIntelligenceProps> = ({ activeWorkspace, currentUser }) => {
    const [topic, setTopic] = useState(activeWorkspace.brandName);
    const [dateRange, setDateRange] = useState('Last 7 Days');
    const [report, setReport] = useState<MediaAndSocialIntelligenceReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    const handleScan = useCallback(async () => {
        if (!topic.trim()) {
            setError('Please enter a topic or keyword to monitor.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setReport(null);
        try {
            const result = await fetchMediaAndSocialIntelligence(activeWorkspace.id, { topic, dateRange, userPersona: currentUser.persona }, currentUser.persona.aiEngine);
            setReport(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [topic, dateRange, activeWorkspace.id, currentUser]);

    const handleExportPdf = async () => {
        if (isExporting || !report) return;
        setIsExporting(true);
        await new Promise(resolve => setTimeout(resolve, 50));
        await exportElementAsPDF('report-content', `Escalate-Intelligence-Report-${topic}`);
        setIsExporting(false);
    };

    const inputClass = "w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none";
    
    const renderReport = () => {
        if(!report) return null;

        return (
            <div id="report-content" className="mt-8 space-y-6">
                <Card>
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Intelligence Report: "{report.topic}"</h2>
                        <button onClick={handleExportPdf} disabled={isExporting} className="btn btn-secondary print-hidden">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            {isExporting ? 'Saving...' : 'Save as PDF'}
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <StatCard title="Total Mentions" value={report.summary.totalMentions} />
                        <StatCard title="Positive" value={`${report.summary.sentimentBreakdown.positive}%`} />
                        <StatCard title="Neutral" value={`${report.summary.sentimentBreakdown.neutral}%`} />
                        <StatCard title="Negative" value={`${report.summary.sentimentBreakdown.negative}%`} />
                    </div>
                    
                    <Card title="Key Insight" className="!bg-amber-500/10 border-amber-500/20">
                        <p className="text-amber-800">{report.summary.keyInsight}</p>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        <Card title="Mentions Over Time" className="!bg-white/50">
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={report.mentionsOverTime}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="date" stroke="#64748b" />
                                    <YAxis stroke="#64748b" />
                                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} />
                                    <Line type="monotone" dataKey="count" name="Mentions" stroke="#f59e0b" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                         <Card title="Top Themes" className="!bg-white/50">
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={report.topThemes} layout="vertical" margin={{top: 5, right: 20, left: 10, bottom: 5}}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis type="number" stroke="#64748b" />
                                    <YAxis dataKey="theme" type="category" width={80} stroke="#64748b" fontSize={12} />
                                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} />
                                    <Bar dataKey="count" name="Count">
                                        {report.topThemes.map((entry, index) => <Cell key={`cell-${index}`} fill={THEME_COLORS[index % THEME_COLORS.length]} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>
                </Card>
                 <Card title="Recent Mentions">
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {report.recentMentions.map((mention, index) => <MentionCard key={index} mention={mention} />)}
                    </div>
                 </Card>
            </div>
        )
    }

    return (
        <div className="fade-in">
            <Header title="Unified Listening Post" subtitle="Monitor your brand, competitors, and keywords across the entire media and social landscape from a single, powerful interface." />
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., Proton S70 reviews" className={`${inputClass} md:col-span-2`} />
                    <select value={dateRange} onChange={e => setDateRange(e.target.value)} className={inputClass}>
                        <option>Last 24 Hours</option>
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                    </select>
                </div>
                <div className="mt-4 flex justify-end">
                    <button onClick={handleScan} disabled={isLoading} className="btn btn-primary">
                        {isLoading ? 'Scanning...' : 'Scan Intelligence Landscape'}
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                </div>
            </Card>

            <div className="mt-8">
                {isLoading && <div className="py-20"><LoadingSpinner /></div>}
                {error && <p className="text-center text-red-600 mt-8">{error}</p>}
                
                {!isLoading && report && renderReport()}
                
                {!isLoading && !report && !error && (
                    <EmptyState
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-slate-400" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 110-7.07m0 7.07V19m0-11.314V5" /></svg>}
                        title="Monitor the Narrative Landscape"
                        message="Enter a topic or brand name to scan for recent media and social mentions, generating an instant intelligence report."
                    />
                )}
            </div>
        </div>
    );
};

export default MediaAndSocialIntelligence;