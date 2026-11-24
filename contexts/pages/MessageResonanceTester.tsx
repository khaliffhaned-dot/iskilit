import * as React from 'react';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import { testPredictiveResonance } from '../../services/aiService.ts';
import { PredictiveResonanceReport, User, Workspace } from '../../types.ts';

interface MessageResonanceTesterProps {
  payload?: any;
  activeWorkspace: Workspace;
  currentUser: User;
}

const MessageResonanceTester: React.FC<MessageResonanceTesterProps> = ({ payload, activeWorkspace, currentUser }) => {
    const [message, setMessage] = React.useState('');
    const [audience, setAudience] = React.useState('');
    const [context, setContext] = React.useState('');
    
    const [report, setReport] = React.useState<PredictiveResonanceReport | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleTest = React.useCallback(async () => {
        if (!message.trim() || !audience.trim() || !context.trim()) {
            setError('Please fill out all fields.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setReport(null);
        try {
            const result = await testPredictiveResonance(activeWorkspace.id, message, audience, context, currentUser.persona, currentUser.persona.aiEngine);
            setReport(result);
        } catch (err) {
            setError('Failed to test message resonance.');
        } finally {
            setIsLoading(false);
        }
    }, [activeWorkspace.id, message, audience, context, currentUser]);

    React.useEffect(() => {
        if (payload) {
            setMessage(payload.messageA || ''); // Use messageA as the single message
            setAudience(payload.audience || '');
            setContext(payload.context || '');
        }
    }, [payload]);
    
    const renderReport = () => {
        if (!report) return null;
        const scoreColor = report.resonanceScore > 75 ? 'text-green-600' : report.resonanceScore > 50 ? 'text-yellow-600' : 'text-red-600';
        return (
            <Card className="mt-8 fade-in">
                <h3 className="text-2xl font-bold text-slate-800">Predictive Resonance Report</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                    <div className="text-center p-6 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-500">Resonance Score</p>
                        <p className={`text-7xl font-extrabold ${scoreColor}`}>{report.resonanceScore}</p>
                    </div>
                    <div className="lg:col-span-2">
                        <Card title="Prediction Summary" className="!bg-slate-50"><p className="text-slate-600">{report.predictionSummary}</p></Card>
                    </div>
                </div>
                <div className="mt-6">
                    <Card title="Analysis & Recommendations" className="!bg-slate-50">
                        <p className="text-slate-600"><strong className="text-slate-800">Alignment with Trends:</strong> {report.alignmentWithTrends}</p>
                        <p className="mt-2 text-slate-600"><strong className="text-slate-800">Potential Risks:</strong> {report.potentialRisks.join(', ')}</p>
                        <p className="mt-2 text-slate-600"><strong className="text-slate-800">Recommendations:</strong> {report.recommendations.join(' ')}</p>
                    </Card>
                </div>
            </Card>
        );
    };
    
    const inputClass = "w-full p-2 border rounded-md bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-amber-500 focus:border-amber-500";

    return (
        <div>
            <Header title="Message Resonance Forecaster" subtitle="See the future. Test key messages against target audiences and media trends to predict their market impact before you launch." />
            <Card>
                <div className="space-y-4">
                    <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Enter the message to test." className={inputClass} />
                    <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="Target Audience" className={inputClass} />
                    <input value={context} onChange={e => setContext(e.target.value)} placeholder="Context / Goal" className={inputClass} />
                </div>
                 <div className="mt-4 flex justify-end items-center">
                    <button onClick={handleTest} disabled={isLoading} className="btn btn-primary flex-grow">
                        {isLoading ? 'Testing...' : 'Test Message'}
                    </button>
                </div>
                {error && <p className="text-center text-red-600 mt-4">{error}</p>}
            </Card>

            {isLoading && <div className="py-20"><LoadingSpinner /></div>}
            {!isLoading && report && renderReport()}
        </div>
    );
};

export default MessageResonanceTester;