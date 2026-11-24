

import React, { useState, useCallback, useEffect } from 'react';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import { runNarrativeSimulation, generateImage } from '../../services/aiService.ts';
import { NarrativeSimulationReport, User, Workspace } from '../../types.ts';
import { exportElementAsPDF } from '../../services/exportService.ts';

interface NarrativeSimulatorProps {
  payload?: any;
  currentUser: User;
  activeWorkspace: Workspace;
}

const SimulatedSocialPost: React.FC<{ post: NarrativeSimulationReport['simulatedSocialMediaFeed'][0] }> = ({ post }) => {
    const sentimentStyles = {
        Positive: 'border-green-500',
        Negative: 'border-red-500',
        Neutral: 'border-slate-400',
    };
    return (
        <div className={`p-4 bg-white rounded-lg border-l-4 ${sentimentStyles[post.sentiment] || sentimentStyles.Neutral}`}>
            <p className="font-bold text-slate-800">{post.author}</p>
            <p className="text-sm text-slate-600 mt-1">{post.content}</p>
            <p className="text-xs text-slate-500 mt-2">{post.platform}</p>
        </div>
    );
};

const NarrativeSimulator: React.FC<NarrativeSimulatorProps> = ({ payload, activeWorkspace, currentUser }) => {
    const [scenario, setScenario] = useState('');
    const [report, setReport] = useState<NarrativeSimulationReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    
    // State for visual generation
    const [generatingVisual, setGeneratingVisual] = useState<Record<number, boolean>>({});
    const [generatedVisuals, setGeneratedVisuals] = useState<Record<number, string | null>>({});

    const handleGeneratePlan = useCallback(async () => {
        if (!scenario.trim()) {
            setError('Please describe a scenario to simulate.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setReport(null);
        setGeneratedVisuals({});
        setGeneratingVisual({});
        try {
            const result = await runNarrativeSimulation(activeWorkspace.id, scenario, currentUser.persona, currentUser.persona.aiEngine);
            setReport(result);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to generate a narrative simulation. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [scenario, activeWorkspace.id, currentUser]);
    
    const handleGenerateVisual = async (prompt: string, index: number) => {
        setGeneratingVisual(prev => ({ ...prev, [index]: true }));
        setGeneratedVisuals(prev => ({ ...prev, [index]: null }));
        try {
            const result = await generateImage(prompt);
            if (result) {
                setGeneratedVisuals(prev => ({ ...prev, [index]: result.base64 }));
            }
        } catch (e) {
            console.error("Visual generation failed:", e);
            // Optionally, set an error state for this specific image
        } finally {
            setGeneratingVisual(prev => ({ ...prev, [index]: false }));
        }
    };


    useEffect(() => {
        if (payload?.scenario) {
            setScenario(payload.scenario);
        }
    }, [payload]);
    
    const handleExportPdf = async () => {
        if (isExporting || !report) return;
        setIsExporting(true);
        await new Promise(resolve => setTimeout(resolve, 50));
        await exportElementAsPDF('report-content', `Escalate-Narrative-Simulation-${scenario.substring(0, 20)}`);
        setIsExporting(false);
    };

    const renderReport = () => {
        if (!report) return null;
        return (
            <div id="report-content" className="mt-8 space-y-6 fade-in">
                 <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-slate-800">Narrative Simulation Report</h2>
                    <button onClick={handleExportPdf} disabled={isExporting} className="btn btn-secondary print-hidden">
                        {isExporting ? 'Saving...' : 'Save as PDF'}
                    </button>
                </div>
                <Card title="Executive Summary" className="!bg-amber-500/10 border-amber-500/20">
                    <p className="text-amber-800">{report.summary}</p>
                </Card>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Likely Media Angles">
                        <ul className="space-y-3">
                            {report.likelyMediaAngles.map((item, i) => (
                                <li key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                                    <p className="font-semibold text-slate-800">{item.angle}</p>
                                    <p className="text-xs text-slate-500 mt-1">{item.outletType}</p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                    <Card title="Potential Journalist Questions">
                        <ul className="list-decimal list-inside space-y-2 text-slate-600">
                            {report.potentialJournalistQuestions.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </Card>
                </div>

                {report.simulatedVisualConcepts && (
                    <Card title="Simulated Visual Content Strategy">
                        <div>
                            <h4 className="font-bold text-slate-800 mb-2">AI Image Generation Prompts</h4>
                            <div className="space-y-4">
                                {report.simulatedVisualConcepts.imagePrompts.map((prompt, i) => (
                                    <div key={i}>
                                        <p className="text-sm text-slate-600 p-2 bg-slate-50 rounded-md border border-slate-200 font-mono">
                                            /imagine prompt: {prompt}
                                        </p>
                                        <button onClick={() => handleGenerateVisual(prompt, i)} disabled={generatingVisual[i]} className="btn btn-secondary text-xs mt-2 print-hidden">
                                            {generatingVisual[i] ? 'Generating...' : 'Generate Image'}
                                        </button>
                                        {generatingVisual[i] && <div className="mt-2"><LoadingSpinner /></div>}
                                        {generatedVisuals[i] && (
                                            <div className="mt-2">
                                                <img src={`data:image/jpeg;base64,${generatedVisuals[i]}`} alt={prompt} className="rounded-lg border border-slate-200 max-w-xs" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div className="mt-4">
                            <h4 className="font-bold text-slate-800 mb-2">Short-form Video Scripts (TikTok/Reels)</h4>
                            <div className="space-y-2">
                                {report.simulatedVisualConcepts.videoScripts.map((script, i) => (
                                     <p key={i} className="text-sm text-slate-600 p-2 bg-slate-50 rounded-md border border-slate-200 whitespace-pre-wrap">
                                        {script}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </Card>
                )}

                <Card title="Simulated Social Media Feed">
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {report.simulatedSocialMediaFeed.map((post, i) => <SimulatedSocialPost key={i} post={post} />)}
                    </div>
                </Card>
                <Card title="Strategic Recommendations">
                    <ul className="list-disc list-inside space-y-2 text-slate-600">
                        {report.strategicRecommendations.map((point, i) => <li key={i}>{point}</li>)}
                    </ul>
                </Card>
            </div>
        );
    };

    return (
        <div className="fade-in">
            <Header title="Narrative Simulator" subtitle="The ultimate strategic sandbox. War-game any scenario—proactive or reactive—to anticipate outcomes and master your response." />
            <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Proactive Product Launch', 'New Policy Announcement', 'Negative Review Crisis', 'Competitor Product Reveal'].map(option => (
                    <button 
                        key={option}
                        onClick={() => setScenario(option)}
                        className={`p-4 rounded-lg border text-left transition-all ${scenario === option ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-500' : 'bg-white border-slate-300 hover:border-amber-400'}`}
                    >
                        <p className="font-semibold text-slate-800">{option}</p>
                    </button>
                ))}
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-slate-600 mb-1">Or Describe a Custom Scenario</label>
                <textarea
                    value={scenario}
                    onChange={e => setScenario(e.target.value)}
                    placeholder="e.g., A proactive product launch, a new policy announcement, or a potential crisis like a negative review."
                    rows={2}
                    className="w-full bg-white border border-slate-300 rounded-lg p-4 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
            </div>
                 <div className="mt-4 flex justify-end items-center">
                    <button
                        onClick={handleGeneratePlan}
                        disabled={isLoading || !scenario.trim()}
                        className="btn btn-primary"
                    >
                        {isLoading ? 'Simulating...' : 'Run AI Simulation'}
                    </button>
                </div>
            </Card>

            <div className="mt-8">
                {error && <p className="text-center text-red-600 mt-8">{error}</p>}
                {isLoading && <div className="py-20"><LoadingSpinner /></div>}
                {!isLoading && report && renderReport()}
            </div>
        </div>
    );
};

export default NarrativeSimulator;