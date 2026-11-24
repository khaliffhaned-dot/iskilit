import * as React from 'react';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import { generateClientReport } from '../../services/aiService.ts';
import { ClientReportData, User, Workspace } from '../../types.ts';
import { exportElementAsPDF } from '../../services/exportService.ts';
import * as analytics from '../../services/analyticsService.ts';

interface ClientReportingProps {
  activeWorkspace: Workspace;
  currentUser: User;
}

const ClientReporting: React.FC<ClientReportingProps> = ({ activeWorkspace, currentUser }) => {
    const [dateRange, setDateRange] = React.useState('Last 30 Days');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [report, setReport] = React.useState<ClientReportData | null>(null);
    const [isExporting, setIsExporting] = React.useState(false);

    const handleGenerate = React.useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setReport(null);
        try {
            const result = await generateClientReport(activeWorkspace.id, activeWorkspace.name, dateRange, currentUser.persona, currentUser.persona.aiEngine);
            if (result) {
                setReport(result);
                analytics.trackEvent('report_generated', { report_type: 'client_reporting' });
            } else {
                setError('Failed to generate client report.');
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [activeWorkspace, dateRange, currentUser]);

    const handleExport = async () => {
        if (!report || isExporting) return;
        setIsExporting(true);
        const fileName = `Client_Report_${activeWorkspace.name}_${dateRange.replace(/\s+/g, '_')}`;
        await exportElementAsPDF('report-content', fileName);
        setIsExporting(false);
    };

    const renderReport = () => {
        if (!report) return null;
        return (
            <div id="report-content" className="bg-white text-slate-800 p-8 rounded-lg mt-8 border border-slate-200">
                 <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">Client Report: {activeWorkspace.name}</h2>
                    <p className="text-slate-500">{dateRange}</p>
                </div>
                
                <div className="space-y-8">
                    <section>
                        <h3 className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">Executive Summary</h3>
                        <p className="text-slate-600 leading-relaxed">{report.executiveSummary}</p>
                    </section>
                    
                    <section>
                        <h3 className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">Key Metrics</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {(report.keyMetrics || []).map(metric => (
                                <div key={metric.name} className="p-4 bg-slate-50 rounded-lg text-center border border-slate-200">
                                    <p className="text-sm font-semibold text-slate-500">{metric.name}</p>
                                    <p className="text-3xl font-bold text-slate-800">{metric.value}</p>
                                    <p className={`text-sm font-bold ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{metric.change}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    
                    <section>
                         <h3 className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">Top Media Mentions</h3>
                         <div className="space-y-4">
                            {(report.mediaMentions || []).map((mention, index) => (
                                <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <a href={mention.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">{mention.headline}</a>
                                    <p className="text-sm text-slate-600 mt-1">{mention.summary}</p>
                                    <p className="text-xs text-slate-500 mt-2">{mention.outlet} - {new Date(mention.timestamp).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        );
    };
    
    return (
        <div className="fade-in">
            <Header title="Automated Proof of Performance" subtitle={`Instantly generate and share comprehensive, data-driven performance reports for ${activeWorkspace.name}.`} />
            <Card>
                <div className="flex items-center space-x-4">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                    </select>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="btn btn-primary px-6 py-3"
                    >
                        {isLoading ? 'Generating...' : 'Generate Report'}
                    </button>
                </div>
                {error && <p className="text-center text-red-600 mt-4">{error}</p>}
            </Card>

            {isLoading && <div className="py-20"><LoadingSpinner /></div>}
            
            {!isLoading && report && (
                <div className="mt-8">
                     <div className="flex justify-end mb-4 gap-2 print-hidden">
                        <button onClick={handleExport} disabled={isExporting} className="btn btn-secondary disabled:opacity-50">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            {isExporting ? 'Exporting...' : 'Save as PDF'}
                        </button>
                    </div>
                    {renderReport()}
                </div>
            )}
        </div>
    );
};

export default ClientReporting;