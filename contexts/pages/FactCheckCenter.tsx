import React, { useState } from 'react';
import Card from '../../components/Card.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import { User, Workspace, VerificationResult, EvidenceItem } from '../../types.ts';
import { ShieldCheck, AlertTriangle, CheckCircle2, HelpCircle, Send, ThumbsUp, ThumbsDown, RefreshCw, Cpu, Database, Globe } from 'lucide-react';

interface FactCheckCenterProps {
    activeWorkspace: Workspace;
    currentUser: User;
}

export const FactCheckCenter: React.FC<FactCheckCenterProps> = ({ activeWorkspace, currentUser }) => {
    const [claimInput, setClaimInput] = useState('');
    const [clarificationAnswer, setClarificationAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<VerificationResult | null>(null);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState<string | null>(null);
    const [feedbackNote, setFeedbackNote] = useState('');
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedFeedbackType, setSelectedFeedbackType] = useState<'accept' | 'dispute' | null>(null);

    const sampleClaims = [
        "Eh, dengar cerita AeroMY nak close down la next week because no funding, betul ke?",
        "AeroMY announces 98% on-time punctuality rate for Q2 across all domestic ASEAN routes.",
        "Viral video claims AeroMY lost 4,000 passenger bags at KLIA Terminal 1 during peak holiday weekend."
    ];

    const handleVerify = async (claimToVerify?: string, clarification?: string) => {
        const targetClaim = claimToVerify || claimInput;
        if (!targetClaim.trim()) return;

        setLoading(true);
        setFeedbackSubmitted(null);
        setFeedbackNote('');

        try {
            const res = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    claim: targetClaim,
                    clarificationAnswer: clarification || clarificationAnswer
                })
            });

            const data = await res.json();
            setResult(data);
            if (!clarification) {
                setClarificationAnswer('');
            }
        } catch (err) {
            console.error("Verification failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFeedbackSubmit = async (responseType: 'accept' | 'dispute') => {
        if (!result) return;
        try {
            await fetch('/api/verify/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recordId: result.recordId,
                    userResponse: responseType,
                    note: feedbackNote
                })
            });
            setFeedbackSubmitted(responseType);
            setShowFeedbackModal(false);
        } catch (err) {
            console.error("Failed to submit feedback:", err);
        }
    };

    const getVerdictBadge = (verdict: string) => {
        switch (verdict) {
            case 'Verified':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-700 border border-emerald-500/30"><CheckCircle2 size={14} /> VERIFIED</span>;
            case 'Partly Verified':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-500/15 text-blue-700 border border-blue-500/30"><ShieldCheck size={14} /> PARTLY VERIFIED</span>;
            case 'Unverified':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-700 border border-amber-500/30"><HelpCircle size={14} /> UNVERIFIED</span>;
            case 'Contradicted':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/15 text-rose-700 border border-rose-500/30"><AlertTriangle size={14} /> CONTRADICTED</span>;
            default:
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-500/15 text-slate-700 border border-slate-500/30"><HelpCircle size={14} /> INSUFFICIENT EVIDENCE</span>;
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-slate-200/50 shadow-[0_8px_32px_0_rgba(15,23,42,0.03)]">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 font-black">
                            <ShieldCheck size={22} />
                        </span>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">SAHIH Verify Engine</h1>
                        <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-slate-900 text-white rounded-md tracking-wider">Hackathon Winner v2</span>
                    </div>
                    <p className="text-slate-600 text-sm">
                        Multi-agent adversarial fact-checking with Admiralty Source Grading (A-F / 1-6) and regional Manglish/BM natural language support.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs font-bold text-slate-500">Active Architecture</div>
                        <div className="text-xs font-extrabold text-slate-800">2x Cloud Run + Firestore + Gemini ADK</div>
                    </div>
                </div>
            </div>

            {/* Input Section */}
            <Card title="Submit Claim for Multi-Agent Verification">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                            Enter Claim (English, Bahasa Malaysia, or Manglish)
                        </label>
                        <div className="flex gap-2">
                            <textarea
                                value={claimInput}
                                onChange={(e) => setClaimInput(e.target.value)}
                                placeholder="e.g. Eh, dengar cerita AeroMY nak close down la next week because no funding, betul ke?"
                                rows={3}
                                className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all resize-none shadow-xs"
                            />
                            <button
                                onClick={() => handleVerify()}
                                disabled={loading || !claimInput.trim()}
                                className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold px-6 rounded-xl flex flex-col items-center justify-center gap-1 transition-all shadow-md cursor-pointer flex-shrink-0"
                            >
                                {loading ? <LoadingSpinner /> : <><Send size={18} /><span>Verify</span></>}
                            </button>
                        </div>
                    </div>

                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Sample Prompts:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {sampleClaims.map((sample, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setClaimInput(sample);
                                        handleVerify(sample);
                                    }}
                                    className="text-xs bg-slate-100 hover:bg-amber-500/10 hover:text-amber-700 text-slate-700 px-3 py-1.5 rounded-lg font-medium transition-all border border-slate-200 text-left"
                                >
                                    "{sample}"
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Clarification Prompt if Awaiting Clarification */}
            {result?.isAwaitingClarification && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl animate-pulse">
                    <div className="flex items-start gap-3">
                        <HelpCircle size={24} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-3">
                            <h3 className="font-extrabold text-amber-900 text-base">Intake & Clarifier Agent: Ambiguity Detected</h3>
                            <p className="text-amber-800 text-sm font-medium">{result.clarificationQuestion}</p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={clarificationAnswer}
                                    onChange={(e) => setClarificationAnswer(e.target.value)}
                                    placeholder="Provide clarifying details..."
                                    className="flex-1 p-2.5 bg-white border border-amber-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                <button
                                    onClick={() => handleVerify(result.normalizedClaim, clarificationAnswer)}
                                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all"
                                >
                                    Submit Clarification
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Grid */}
            {result && !result.isAwaitingClarification && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Zone 1: Agent Reasoning Trace & Verdict Summary */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card title="AI Verification Verdict">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Status</span>
                                    {getVerdictBadge(result.verdict)}
                                </div>

                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Confidence Score</span>
                                    <span className="text-lg font-black text-slate-900">{result.confidence}%</span>
                                </div>

                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Language / Domain</span>
                                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800">{result.languageDetected}</span>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Normalized Proposition</h4>
                                    <p className="text-xs font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200">{result.normalizedClaim}</p>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Reasoning Chain</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">{result.reasoning}</p>
                                </div>

                                {/* Feedback / Dispute Action */}
                                <div className="pt-2 border-t border-slate-100">
                                    <span className="text-xs font-bold text-slate-500 uppercase block mb-2">Executive Feedback Loop</span>
                                    {feedbackSubmitted ? (
                                        <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/20">
                                            Feedback recorded: Thank you for {feedbackSubmitted === 'accept' ? 'accepting' : 'disputing'} this verdict!
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setSelectedFeedbackType('accept'); setShowFeedbackModal(true); }}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs border border-emerald-200 transition-all"
                                            >
                                                <ThumbsUp size={14} /> Accept Verdict
                                            </button>
                                            <button
                                                onClick={() => { setSelectedFeedbackType('dispute'); setShowFeedbackModal(true); }}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs border border-rose-200 transition-all"
                                            >
                                                <ThumbsDown size={14} /> Dispute
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Agent Trace Log */}
                        <Card title="Multi-Agent Execution Trace">
                            <div className="space-y-3">
                                {result.trace.map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                                        <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                                            {idx + 1}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-slate-900">{step.agentName}</span>
                                                <span className="text-[10px] text-emerald-600 font-bold uppercase">{step.status}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-600 mt-0.5">{step.action}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Zone 2: Graded Evidence Items with Admiralty Codes */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card title="Admiralty Graded Evidence Ledger">
                            <p className="text-xs text-slate-500 mb-4">
                                NATO Admiralty System evaluation: Source Reliability (A to F) combined with Information Credibility (1 to 6).
                            </p>

                            <div className="space-y-4">
                                {result.evidence.map((ev: EvidenceItem) => (
                                    <div key={ev.id} className="bg-slate-50/80 border border-slate-200/70 p-5 rounded-2xl hover:border-slate-300 transition-all shadow-xs">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div>
                                                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                                                    <Globe size={16} className="text-blue-600" />
                                                    {ev.source}
                                                </h4>
                                                {ev.url && <a href={ev.url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 hover:underline">{ev.url}</a>}
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <div className="px-3 py-1 rounded-xl bg-slate-900 text-white text-xs font-black tracking-widest shadow-sm">
                                                    Code: {ev.admiraltyCode}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/50 mb-3 italic">
                                            "{ev.snippet}"
                                        </p>

                                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold text-slate-600">Reliability: <span className="text-slate-900 font-black">{ev.reliability}</span></span>
                                                <span className="font-bold text-slate-600">Credibility: <span className="text-slate-900 font-black">{ev.credibility}</span></span>
                                            </div>
                                            <span className="text-slate-500 font-medium">{ev.justification}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* Feedback Modal */}
            {showFeedbackModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
                        <h3 className="text-lg font-black text-slate-900">
                            {selectedFeedbackType === 'accept' ? 'Accept Verification Verdict' : 'Dispute Verification Verdict'}
                        </h3>
                        <p className="text-xs text-slate-600">
                            Provide optional notes or corrections for our multi-agent feedback ledger.
                        </p>
                        <textarea
                            value={feedbackNote}
                            onChange={(e) => setFeedbackNote(e.target.value)}
                            placeholder="Enter notes or additional context..."
                            rows={3}
                            className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowFeedbackModal(false)}
                                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => selectedFeedbackType && handleFeedbackSubmit(selectedFeedbackType)}
                                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md"
                            >
                                Submit Feedback
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FactCheckCenter;
