import React, { useState, useMemo } from 'react';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import EmptyState from '../../components/EmptyState.tsx';
import { exportElementAsPDF } from '../../services/exportService.ts';
import { Workspace, UserContext, ContentRiskAlert } from '../../types.ts';
import { mockContentRisks } from '../../services/malaysianMockData.ts';

interface ContentSafetyProps {
    activeWorkspace: Workspace;
    currentUser: UserContext;
}

const THREAT_LEVEL_COLORS: Record<string, string> = {
    'Low': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Elevated': 'bg-amber-50 text-amber-700 border-amber-200',
    'Critical': 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse',
};

const ACTION_COLORS: Record<string, string> = {
    'Quarantined': 'bg-purple-100 text-purple-800',
    'Under Review': 'bg-amber-100 text-amber-800',
    'Cleared': 'bg-emerald-100 text-emerald-800',
    'Takedown Requested': 'bg-rose-100 text-rose-800',
};

const ContentSafetyAndIntegrity: React.FC<ContentSafetyProps> = ({ activeWorkspace, currentUser }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<ContentRiskAlert[] | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [filterThreat, setFilterThreat] = useState<string>('All');

    const handleAnalyze = async () => {
        setIsLoading(true);
        setTimeout(() => {
            setData(mockContentRisks as ContentRiskAlert[]);
            setIsLoading(false);
        }, 1500);
    };

    const handleExportPdf = async () => {
        if (isExporting || !data) return;
        setIsExporting(true);
        await new Promise(resolve => setTimeout(resolve, 50));
        await exportElementAsPDF('report-content', `Escalate-Threat-Radar`);
        setIsExporting(false);
    };

    const filteredData = useMemo(() => {
        if (!data) return [];
        if (filterThreat === 'All') return data;
        return data.filter(d => d.threatLevel === filterThreat);
    }, [data, filterThreat]);

    return (
        <div className="fade-in pb-12">
            <Header title="Content Safety & Integrity (Threat Radar)" subtitle="Triage inbound threats by severity and vector (Bots, Deepfakes, 3R violations)." />
            
            <Card className="mb-8">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="e.g., Scan for 'AeroMY' across all social platforms"
                        className="flex-grow w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-800"
                        onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        className="btn btn-primary w-full sm:w-auto whitespace-nowrap flex items-center gap-2 justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        {isLoading ? 'Scanning...' : 'Run Threat Scan'}
                    </button>
                </div>
            </Card>

            <div id="report-content">
                {isLoading && <div className="py-20"><LoadingSpinner /></div>}
                
                {data && !isLoading && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex gap-2 flex-wrap">
                                {['All', 'Critical', 'Elevated', 'Low'].map(level => (
                                    <button
                                        key={level}
                                        onClick={() => setFilterThreat(level)}
                                        className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ${
                                            filterThreat === level 
                                            ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        {level} {level !== 'All' && 'Threats'}
                                    </button>
                                ))}
                            </div>
                            <button onClick={handleExportPdf} disabled={isExporting} className="btn btn-secondary text-sm print-hidden">
                                {isExporting ? 'Saving...' : 'Export Triage Report'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {filteredData.map(alert => (
                                <div key={alert.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row">
                                        
                                        {/* Left Status Bar */}
                                        <div className={`w-full md:w-2 ${
                                            alert.threatLevel === 'Critical' ? 'bg-rose-500' :
                                            alert.threatLevel === 'Elevated' ? 'bg-amber-500' : 'bg-emerald-500'
                                        }`}></div>
                                        
                                        <div className="p-5 flex-grow">
                                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-3">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="font-bold text-slate-900 text-lg">{alert.vector}</span>
                                                        <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border ${THREAT_LEVEL_COLORS[alert.threatLevel] || 'bg-slate-100 text-slate-600'}`}>
                                                            {alert.threatLevel}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                                        <span className="flex items-center gap-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                            </svg>
                                                            {new Date(alert.timestamp).toLocaleString()}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                                            </svg>
                                                            Platform: {alert.platform}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex-shrink-0">
                                                    <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full ${ACTION_COLORS[alert.actionTaken] || 'bg-slate-100 text-slate-600'}`}>
                                                        {alert.actionTaken}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                                                <p className="text-slate-700 text-sm font-medium font-mono leading-relaxed">"{alert.snippet}"</p>
                                            </div>
                                            
                                            <div>
                                                <h4 className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider mb-1 flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                                    </svg>
                                                    AI Recommendation
                                                </h4>
                                                <p className="text-sm text-slate-800">{alert.aiRecommendation}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {filteredData.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-slate-500">No threats found for the selected level.</p>
                            </div>
                        )}
                    </div>
                )}

                {!isLoading && !data && (
                    <EmptyState
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                        title="Content Safety Radar"
                        message="Run a scan to detect and triage inbound threats to your brand."
                    />
                )}
            </div>
        </div>
    );
};

export default ContentSafetyAndIntegrity;
