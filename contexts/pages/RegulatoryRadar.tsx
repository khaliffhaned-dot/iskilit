import React, { useState, useMemo } from 'react';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import EmptyState from '../../components/EmptyState.tsx';
import { Workspace, UserContext, RegulatoryShift } from '../../types.ts';
import { mockRegulatoryShifts } from '../../services/malaysianMockData.ts';
import { exportElementAsPDF } from '../../services/exportService.ts';

interface RegulatoryRadarProps {
    activeWorkspace: Workspace;
    currentUser: UserContext;
}

const STATUS_COLORS: Record<string, string> = {
    'Rumored': 'bg-slate-100 text-slate-600 border-slate-200',
    'Drafting Phase': 'bg-blue-50 text-blue-700 border-blue-200',
    'Active Debate': 'bg-amber-50 text-amber-700 border-amber-200',
    'Enacted': 'bg-red-50 text-red-700 border-red-200',
};

const RISK_COLORS: Record<string, string> = {
    'Revenue Loss': 'text-rose-600 bg-rose-50 border-rose-100',
    'Operational Bottleneck': 'text-amber-600 bg-amber-50 border-amber-100',
    'Reputational Damage': 'text-purple-600 bg-purple-50 border-purple-100',
};

const RegulatoryRadar: React.FC<RegulatoryRadarProps> = ({ activeWorkspace, currentUser }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<RegulatoryShift[] | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('All');

    const handleScan = async () => {
        setIsLoading(true);
        setTimeout(() => {
            setData(mockRegulatoryShifts as RegulatoryShift[]);
            setIsLoading(false);
        }, 1500);
    };

    const handleExportPdf = async () => {
        if (isExporting || !data) return;
        setIsExporting(true);
        await new Promise(resolve => setTimeout(resolve, 50));
        await exportElementAsPDF('report-content', `Escalate-Regulatory-Radar`);
        setIsExporting(false);
    };

    const filteredData = useMemo(() => {
        if (!data) return [];
        if (selectedStatus === 'All') return data;
        return data.filter(d => d.status === selectedStatus);
    }, [data, selectedStatus]);

    const statuses = useMemo(() => {
        if (!data) return [];
        const st = new Set(data.map(d => d.status));
        return ['All', ...Array.from(st)];
    }, [data]);

    return (
        <div className="fade-in pb-12">
            <Header title="Regulatory Radar & Risk Board" subtitle="Track macro-environmental policy shifts and calculate their operational exposure." />
            
            <Card className="mb-8">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Scan for policy updates (e.g., Aviation, Transport, Taxation)"
                        className="flex-grow w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-800"
                        onKeyDown={e => e.key === 'Enter' && handleScan()}
                    />
                    <button
                        onClick={handleScan}
                        disabled={isLoading}
                        className="btn btn-primary w-full sm:w-auto whitespace-nowrap"
                    >
                        {isLoading ? 'Scanning...' : 'Run Scan'}
                    </button>
                </div>
            </Card>

            <div id="report-content">
                {isLoading && <div className="py-20"><LoadingSpinner /></div>}

                {data && !isLoading && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex gap-2 flex-wrap">
                                {statuses.map(st => (
                                    <button
                                        key={st}
                                        onClick={() => setSelectedStatus(st)}
                                        className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ${
                                            selectedStatus === st 
                                            ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        {st}
                                    </button>
                                ))}
                            </div>
                            <button onClick={handleExportPdf} disabled={isExporting} className="btn btn-secondary text-sm print-hidden">
                                {isExporting ? 'Saving...' : 'Export Board'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredData.map(shift => (
                                <div key={shift.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                                    <div className="p-5 border-b border-slate-100 flex-grow">
                                        <div className="flex justify-between items-start mb-3 gap-4">
                                            <h3 className="font-bold text-slate-900 text-lg leading-tight">{shift.policyName}</h3>
                                            <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded border whitespace-nowrap ${STATUS_COLORS[shift.status] || 'bg-slate-100 text-slate-600'}`}>
                                                {shift.status}
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-500 mb-4">{shift.governingBody}</p>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Executive Summary</h4>
                                                <p className="text-sm text-slate-700 leading-relaxed">{shift.summary}</p>
                                            </div>
                                            
                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Mitigation Strategy</h4>
                                                <p className="text-sm text-slate-700 italic">"{shift.mitigationStrategy}"</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Primary Risk</span>
                                            <span className={`text-xs font-bold px-2 py-1 mt-1 rounded border ${RISK_COLORS[shift.primaryRisk] || 'bg-slate-100 text-slate-600'}`}>
                                                {shift.primaryRisk}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Impact Score</span>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <span className={`text-xl font-black ${
                                                    shift.impactScore >= 8 ? 'text-rose-600' :
                                                    shift.impactScore >= 5 ? 'text-amber-600' : 'text-emerald-600'
                                                }`}>
                                                    {shift.impactScore}
                                                </span>
                                                <span className="text-xs text-slate-400 font-bold">/10</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!isLoading && !data && (
                    <EmptyState
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                        title="Regulatory Radar"
                        message="Run a scan to detect and analyze emerging policy shifts in your operational environment."
                    />
                )}
            </div>
        </div>
    );
};

export default RegulatoryRadar;
