import * as React from 'react';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import { fetchEventIntelligenceReport } from '../../services/aiService.ts';
import { EventIntelligenceReport, MonitoredEvent, GroundedNews, User, Workspace } from '../../types.ts';
import { exportElementAsPDF } from '../../services/exportService.ts';
import SourceCard from '../../components/SourceCard.tsx';

const EventCard: React.FC<{ event: MonitoredEvent }> = ({ event }) => {
    const scoreColor = event.relevanceScore > 75 ? 'bg-green-500' : event.relevanceScore > 50 ? 'bg-amber-500' : 'bg-red-500';

    return (
        <Card className="mb-8 relative pl-16">
            <span className="absolute -left-4 top-8 flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full ring-8 ring-slate-100 text-white font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
            </span>
            <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">{event.title}</h3>
                    <p className="text-sm font-semibold text-blue-600">{event.date} &bull; {event.location}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 mb-1">Relevance Score</p>
                    <div className="w-24 bg-slate-200 rounded-full h-2.5">
                        <div className={`${scoreColor} h-2.5 rounded-full`} style={{ width: `${event.relevanceScore}%` }}></div>
                    </div>
                </div>
            </div>
            <p className="text-slate-600 my-4">{event.summary}</p>
            
            <div>
                <h4 className="font-semibold text-slate-700 mb-2">Recent Updates</h4>
                <div className="space-y-3">
                    {(event.updates || []).map((update, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border-l-4 border-slate-300">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <div>
                                <p className="text-xs font-bold text-slate-500">{update.timestamp}</p>
                                <p className="text-sm text-slate-600">{update.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {event.sources && event.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <h4 className="font-semibold text-slate-700 mb-2">Sources</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {(event.sources || []).map((source, index) => <SourceCard key={index} source={source} />)}
                    </div>
                </div>
            )}
        </Card>
    );
};

const EventIntelligence: React.FC<{ currentUser: User, activeWorkspace: Workspace }> = ({ currentUser, activeWorkspace }) => {
    const [report, setReport] = React.useState<EventIntelligenceReport | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [isExporting, setIsExporting] = React.useState(false);

    const loadEvents = React.useCallback(async (forceRefresh = false) => {
        if (forceRefresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }
        setError(null);
        try {
            const result = await fetchEventIntelligenceReport(activeWorkspace.id, { forceRefresh, userPersona: currentUser.persona }, currentUser.persona.aiEngine);
            setReport(result);
            if (!result || result.events.length === 0) {
                 setError("No breaking events found at this time. Try refreshing later.");
            }
        } catch (err) {
            setError('Failed to fetch event intelligence. Please try again.');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [currentUser]);

    const handleExportPdf = async () => {
        if(isExporting) return;
        setIsExporting(true);
        await new Promise(resolve => setTimeout(resolve, 50));
        const fileName = `Escalate-Event-Intelligence-${new Date().toISOString().split('T')[0]}`;
        await exportElementAsPDF('report-content', fileName);
        setIsExporting(false);
    };

    React.useEffect(() => {
        loadEvents(false);
    }, [loadEvents]);

    return (
        <div className="fade-in">
            <Header title="Live Event & Horizon Scanning" subtitle="Maintain situational awareness with real-time monitoring of breaking news, developing situations, and emerging events." />

            <div className="flex justify-end mb-6">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => loadEvents(true)}
                        disabled={isLoading || isRefreshing}
                        title="Force refresh"
                        className="btn btn-secondary disabled:opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 10.5M20 20l-1.5-1.5A9 9 0 003.5 13.5" />
                        </svg>
                        {isRefreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                    {report?.events && report.events.length > 0 && (
                        <button onClick={handleExportPdf} disabled={isExporting} className="btn btn-secondary print-hidden disabled:opacity-50">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            {isExporting ? 'Saving...' : 'Save as PDF'}
                        </button>
                    )}
                </div>
            </div>

            <div id="report-content">
                {isLoading && <div className="py-20"><LoadingSpinner /></div>}
                
                {error && !isLoading && !isRefreshing && (
                    <Card><p className="text-center text-amber-600 py-10">{error}</p></Card>
                )}
                
                {!isLoading && report?.events && report.events.length > 0 && (
                    <div className="relative border-l-4 border-slate-200 ml-4">
                        {(report.events || []).map((event, index) => (
                            <EventCard key={index} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventIntelligence;