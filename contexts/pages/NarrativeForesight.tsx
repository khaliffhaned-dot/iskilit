import * as React from 'react';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import { generateNarrativeForesightReport } from '../../services/aiService.ts';
import { NarrativeForesightReport, NarrativeNode, User, Workspace } from '../../types.ts';
import EmptyState from '../../components/EmptyState.tsx';
import { exportElementAsPDF } from '../../services/exportService.ts';

interface NarrativeForesightProps {
    currentUser: User;
    activeWorkspace: Workspace;
}

const LikelihoodMeter: React.FC<{ value: number }> = ({ value }) => {
    const getColor = (v: number) => {
        if (v > 70) return 'bg-red-500';
        if (v > 40) return 'bg-amber-500';
        return 'bg-green-500';
    };

    return (
        <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div className={`${getColor(value)} h-2.5 rounded-full`} style={{ width: `${value}%` }}></div>
        </div>
    );
};

const NarrativeCard: React.FC<{ node: NarrativeNode }> = ({ node }) => (
    <Card className="flex flex-col h-full !bg-white">
        <h4 className="text-lg font-bold text-slate-800">{node.title}</h4>
        <div className="flex items-center gap-4 my-2 text-xs font-semibold">
            <span className="bg-blue-500/20 text-blue-700 px-2 py-0.5 rounded-full">{node.timeframe}</span>
            <span className={`px-2 py-0.5 rounded-full ${node.potentialImpact === 'High' ? 'bg-red-500/20 text-red-700' : node.potentialImpact === 'Medium' ? 'bg-amber-500/20 text-amber-700' : 'bg-green-500/20 text-green-700'}`}>
                {node.potentialImpact} Impact
            </span>
        </div>
        <p className="text-sm text-slate-600 flex-grow mt-2">{node.summary}</p>
        <div className="mt-4">
            <p className="text-xs font-bold text-slate-500 mb-1">Likelihood: {node.likelihood}%</p>
            <LikelihoodMeter value={node.likelihood} />
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200">
            <h5 className="text-sm font-semibold text-slate-800 mb-2">Driving Factors:</h5>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                {node.drivingFactors.map((factor, i) => <li key={i}>{factor}</li>)}
            </ul>
        </div>
    </Card>
);

const NarrativeForesight: React.FC<NarrativeForesightProps> = ({ currentUser, activeWorkspace }) => {
    const [report, setReport] = React.useState<NarrativeForesightReport | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [isExporting, setIsExporting] = React.useState(false);
    const [market, setMarket] = React.useState('Malaysia');

    const handleGenerate = React.useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setReport(null);
        try {
            const result = await generateNarrativeForesightReport(market, currentUser, currentUser.persona.aiEngine);
            setReport(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [market, currentUser]);
    
    React.useEffect(() => {
        handleGenerate();
    }, [handleGenerate]);

    const handleExportPdf = async () => {
        if (isExporting || !report) return;
        setIsExporting(true);
        await new Promise(resolve => setTimeout(resolve, 50));
        await exportElementAsPDF('report-content', `Escalate-Narrative-Foresight-${new Date().toISOString().split('T')[0]}`);
        setIsExporting(false);
    };
    
    const inputClass = "flex-grow w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none";

    return (
        <div className="fade-in">
            <Header title="Narrative Foresight" subtitle="Anticipate emerging media narratives to proactively shape your communications strategy." />

            <Card className="mb-8">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                     <input
                        type="text"
                        value={market}
                        onChange={(e) => setMarket(e.target.value)}
                        placeholder="Enter market or topic, e.g., 'Malaysia'"
                        className={inputClass}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="btn btn-primary w-full sm:w-auto flex-shrink-0"
                    >
                        {isLoading ? 'Scanning...' : 'Generate Foresight Report'}
                    </button>
                </div>
            </Card>

            <div id="report-content">
                {isLoading && <div className="py-20"><LoadingSpinner /></div>}
                {error && <Card><p className="py-10 text-center text-amber-600">{error}</p></Card>}
                {report && (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-slate-800">Emerging Narratives for {market}</h2>
                            <button onClick={handleExportPdf} disabled={isExporting} className="btn btn-secondary print-hidden">
                                {isExporting ? 'Saving...' : 'Save as PDF'}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(report.narratives || []).map((node, index) => (
                                <NarrativeCard key={index} node={node} />
                            ))}
                        </div>
                    </>
                )}
                 {!isLoading && !report && !error && (
                    <EmptyState
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-slate-400" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10.5 L20.5 3 M3.5 10.5 L11 3 M12 12 L12 21 M7.5 16.5 L16.5 16.5" /></svg>}
                        title="Generate a Narrative Foresight Report"
                        message="Enter a market or topic to identify and analyze potential future media narratives."
                    />
                )}
            </div>
        </div>
    );
};

export default NarrativeForesight;