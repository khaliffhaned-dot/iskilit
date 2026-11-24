import * as React from 'react';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import { generateInterviewBriefing, analyzeInterviewAnswer } from '../../services/aiService.ts';
import { InterviewBriefing, AnswerFeedback, User, Workspace } from '../../types.ts';
import EmptyState from '../../components/EmptyState.tsx';
import { exportElementAsPDF } from '../../services/exportService.ts';

interface InterviewPlannerProps {
    activeWorkspace: Workspace;
    currentUser: User;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

type PlannerState = 'setup' | 'briefing' | 'training' | 'report';

const InterviewPlanner: React.FC<InterviewPlannerProps> = ({ activeWorkspace, currentUser }) => {
    const [topic, setTopic] = React.useState('');
    const [outlet, setOutlet] = React.useState('');
    const [plannerState, setPlannerState] = React.useState<PlannerState>('setup');
    const [briefing, setBriefing] = React.useState<InterviewBriefing | null>(null);
    const [sessionHistory, setSessionHistory] = React.useState<AnswerFeedback[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);

    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [isExporting, setIsExporting] = React.useState(false);
    
    // Recording state
    const [isRecording, setIsRecording] = React.useState(false);
    const [mediaRecorder, setMediaRecorder] = React.useState<MediaRecorder | null>(null);
    const audioChunks = React.useRef<Blob[]>([]);

    const handleGenerateBriefing = React.useCallback(async () => {
        if (!topic.trim() || !outlet.trim()) {
            setError('Please provide both a topic and a media outlet.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setBriefing(null);
        try {
            const result = await generateInterviewBriefing(activeWorkspace.id, { topic, outlet, userPersona: currentUser.persona }, currentUser.persona.aiEngine);
            setBriefing(result);
            setPlannerState('briefing');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
            setPlannerState('setup');
        } finally {
            setIsLoading(false);
        }
    }, [topic, outlet, activeWorkspace.id, currentUser]);

    const startRecording = async () => {
        if (mediaRecorder) {
            mediaRecorder.start();
            setIsRecording(true);
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);
            audioChunks.current = [];

            recorder.ondataavailable = event => {
                audioChunks.current.push(event.data);
            };

            recorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                const base64Audio = await blobToBase64(audioBlob);
                processAnswer(base64Audio, 'audio/webm');
                 // Stop all tracks to turn off the microphone indicator
                stream.getTracks().forEach(track => track.stop());
            };

            recorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            setError('Could not access microphone. Please ensure permission is granted.');
        }
    };
    
    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
            setIsLoading(true); // Now we are processing
        }
    };

    const processAnswer = async (base64Audio: string, mimeType: string) => {
        if (!briefing || briefing.likelyQuestions.length === 0) return;

        const currentQuestion = sessionHistory.length > 0
            ? sessionHistory[sessionHistory.length - 1].followUpQuestion
            : briefing.likelyQuestions[currentQuestionIndex].question;

        if (!currentQuestion) return;

        try {
            const result = await analyzeInterviewAnswer(activeWorkspace.id, {
                question: currentQuestion,
                audio: { data: base64Audio, mimeType },
                keyTalkingPoints: briefing.keyTalkingPoints,
                userPersona: currentUser.persona
            }, currentUser.persona.aiEngine);
            if(result) {
                setSessionHistory(prev => [...prev, result]);
                 if (!result.followUpQuestion) {
                    setPlannerState('report');
                }
            } else {
                 setError('Failed to analyze the answer.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to analyze answer.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextQuestion = () => {
        if (briefing && currentQuestionIndex < briefing.likelyQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setPlannerState('report');
        }
    };

    const handleExportPdf = async () => {
        if (isExporting || !briefing) return;
        setIsExporting(true);
        await new Promise(resolve => setTimeout(resolve, 50));
        await exportElementAsPDF('report-content', `Escalate-Interview-Report-${topic.substring(0, 20)}`);
        setIsExporting(false);
    };

    const inputClass = "w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none";
    const labelClass = "block text-sm font-medium text-slate-700 mb-1";
    
    const renderSetup = () => (
        <Card>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Interview Details</h3>
            <p className="text-slate-500 mb-6">Provide the context for the interview to generate a tailored briefing document and training session.</p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="topic" className={labelClass}>Interview Topic *</label>
                    <input id="topic" type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., Q3 financial results and new product line" className={inputClass} />
                </div>
                <div>
                    <label htmlFor="outlet" className={labelClass}>Media Outlet *</label>
                    <input id="outlet" type="text" value={outlet} onChange={e => setOutlet(e.target.value)} placeholder="e.g., The Edge, BFM 89.9" className={inputClass} />
                </div>
            </div>
            <div className="mt-6 flex justify-end items-center">
                <button onClick={handleGenerateBriefing} disabled={isLoading || !topic || !outlet} className="btn btn-primary">
                    {isLoading ? 'Generating...' : 'Generate Briefing'}
                </button>
            </div>
        </Card>
    );
    
    const renderBriefing = () => {
        if (!briefing) return null;
        return (
            <Card>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Interview Briefing</h2>
                        <p className="text-slate-500">Topic: "{briefing.topic}" with {briefing.outlet}</p>
                    </div>
                    <button onClick={() => setPlannerState('training')} className="btn btn-primary">
                        Start Training Session →
                    </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <Card title="Likely Questions" className="!bg-slate-50">
                        <ul className="space-y-3">
                            {(briefing.likelyQuestions || []).map((q, i) => (
                                <li key={i} className="p-3 bg-white rounded-md border border-slate-200">
                                    <p className="font-semibold text-slate-800">{q.question}</p>
                                    <p className="text-xs text-slate-500 italic mt-1">{q.context}</p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                    <div className="space-y-6">
                        <Card title="Key Talking Points" className="!bg-slate-50">
                             <ul className="list-disc list-inside space-y-2 text-slate-600">
                                {(briefing.keyTalkingPoints || []).map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                        </Card>
                        <Card title="Interviewer Persona" className="!bg-slate-50">
                            <h4 className="font-bold text-amber-600">{briefing.interviewerPersona.name}</h4>
                            <p className="text-sm mt-1 text-slate-600"><strong>Style:</strong> {briefing.interviewerPersona.style}</p>
                            <p className="text-sm mt-1 text-slate-600"><strong>Potential Agenda:</strong> {briefing.interviewerPersona.potentialAgenda}</p>
                        </Card>
                    </div>
                </div>
            </Card>
        );
    };

    const renderTraining = () => {
        if (!briefing) return null;
        const lastAnswer = sessionHistory.length > 0 ? sessionHistory[sessionHistory.length-1] : null;
        const currentQuestion = lastAnswer?.followUpQuestion || briefing.likelyQuestions[currentQuestionIndex].question;

        return(
            <div className="space-y-6">
                <Card>
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-1">Question {sessionHistory.length + 1}</h2>
                            <p className="text-2xl font-semibold text-amber-600">"{currentQuestion}"</p>
                        </div>
                    </div>
                    <div className="mt-6 flex flex-col items-center">
                        <button onClick={isRecording ? stopRecording : startRecording} disabled={isLoading} className={`px-8 py-4 rounded-full text-slate-900 font-bold text-lg flex items-center gap-3 transition-all ${isRecording ? 'bg-red-500 animate-pulse text-white' : 'bg-amber-500 hover:bg-amber-400'} disabled:bg-slate-300`}>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-14 0m7 6V5m-4 6v-2m8 2v-2m-4 6v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v2a3 3 0 01-3 3z" /></svg>
                           {isLoading ? "Analyzing..." : (isRecording ? 'Stop Recording' : 'Record Answer')}
                        </button>
                    </div>
                </Card>

                {lastAnswer && !isLoading && (
                    <Card className="fade-in">
                        <h3 className="font-bold text-slate-800 mb-4">Feedback on Your Last Answer</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                             <div className="lg:col-span-2 space-y-4">
                                <div><h4 className="font-semibold text-amber-600">Your Answer (Transcript):</h4><p className="p-3 bg-slate-50 rounded-md text-slate-600 italic border border-slate-200">"{lastAnswer.transcript}"</p></div>
                                <div><h4 className="font-semibold text-amber-600">Overall Feedback:</h4><p className="text-slate-600">{lastAnswer.feedback.overall}</p></div>
                             </div>
                             <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-lg border border-slate-200">
                                <p className="text-slate-500 text-sm">Performance Score</p>
                                <p className="text-7xl font-bold text-amber-600">{lastAnswer.score}</p>
                             </div>
                        </div>
                         <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
                            <button onClick={handleNextQuestion} className="btn btn-primary">
                                {lastAnswer.followUpQuestion ? 'Next Question' : 'Finish Session'}
                            </button>
                        </div>
                    </Card>
                )}
            </div>
        )
    };
    
    const renderReport = () => {
        return (
            <div id="report-content">
                <Card>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Interview Session Report</h2>
                        <button onClick={handleExportPdf} disabled={isExporting} className="btn btn-secondary print-hidden">
                            {isExporting ? 'Saving...' : 'Save as PDF'}
                        </button>
                    </div>
                    {sessionHistory.map((item, index) => (
                        <div key={index} className="mb-6 pb-6 border-b border-slate-200 last:border-b-0">
                            <h3 className="font-bold text-lg text-slate-800">Question {index + 1}: <span className="font-normal text-amber-600">"{item.question}"</span></h3>
                            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-4">
                                    <div><h4 className="font-semibold text-amber-600">Your Answer (Transcript):</h4><p className="p-3 bg-slate-50 border border-slate-200 rounded-md text-slate-600 italic">"{item.transcript}"</p></div>
                                    <div><h4 className="font-semibold text-amber-600">AI Feedback:</h4><p className="text-slate-600">{item.feedback.overall}</p></div>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-lg border border-slate-200">
                                    <p className="text-slate-500 text-sm">Performance Score</p>
                                    <p className="text-7xl font-bold text-amber-600">{item.score}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="mt-8 flex justify-center">
                        <button onClick={() => setPlannerState('setup')} className="btn btn-primary">Start New Session</button>
                    </div>
                </Card>
            </div>
        )
    }

    const renderContent = () => {
        if(isLoading && plannerState === 'setup') return <div className="py-20"><LoadingSpinner /></div>;
        if(error) return <Card><p className="py-10 text-center text-red-600">{error}</p></Card>

        switch(plannerState) {
            case 'setup': return renderSetup();
            case 'briefing': return renderBriefing();
            case 'training': return renderTraining();
            case 'report': return renderReport();
            default: return (
                <EmptyState
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-slate-400" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0m7 6V5m-4 6v-2m8 2v-2m-4 6v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v2a3 3 0 01-3 3z" /></svg>}
                    title="AI Interview Coach"
                    message="Prepare for any media interview by generating a tailored briefing and engaging in an interactive practice session with AI feedback."
                />
            );
        }
    }

    return (
        <div className="fade-in">
            <Header title="AI Media Trainer" subtitle="Master the message. Prepare spokespeople for any media engagement with AI-generated briefings and interactive Q&A sessions."/>
            {renderContent()}
        </div>
    );
};

export default InterviewPlanner;