import React, { useState } from 'react';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import { Workspace, UserContext } from '../../types.ts';
import { exportElementAsPDF } from '../../services/exportService.ts';

interface CrisisSimulatorProps {
    activeWorkspace: Workspace;
    currentUser: UserContext;
}

type NodeId = string;

interface SimulationNode {
    id: NodeId;
    title: string;
    description: string;
    options: {
        text: string;
        nextNodeId: NodeId;
        impact: {
            reputation: number;
            finance: number;
            legal: number;
        };
    }[];
    isTerminal?: boolean;
    terminalMessage?: string;
}

const crisisNodes: Record<NodeId, SimulationNode> = {
    'start': {
        id: 'start',
        title: 'Crisis Alert: Viral Safety Accusation',
        description: 'A prominent local influencer has posted a highly emotive video claiming that AeroMY compromised on safety checks for its A320 fleet to cut costs. The video has reached 500k views within 2 hours. Mainstream media is starting to pick it up.',
        options: [
            {
                text: 'Issue an immediate, strong legal threat and demand a takedown.',
                nextNodeId: 'legal_threat',
                impact: { reputation: -15, finance: -5, legal: -10 }
            },
            {
                text: 'Publish a calm, fact-based holding statement about safety records.',
                nextNodeId: 'holding_statement',
                impact: { reputation: 10, finance: 0, legal: 5 }
            },
            {
                text: 'Ignore the video. Do not legitimize it with a response.',
                nextNodeId: 'ignore_video',
                impact: { reputation: -25, finance: -10, legal: 0 }
            }
        ]
    },
    'legal_threat': {
        id: 'legal_threat',
        title: 'The Streisand Effect',
        description: 'The influencer screenshots the legal letter. Public backlash is severe, framing AeroMY as a corporate bully silencing whistleblowers. The issue is now the #1 trending topic nationwide.',
        options: [
            {
                text: 'Double down and file a defamation lawsuit.',
                nextNodeId: 'lawsuit',
                impact: { reputation: -30, finance: -20, legal: -15 }
            },
            {
                text: 'Withdraw the threat and apologize publicly.',
                nextNodeId: 'apologize',
                impact: { reputation: -5, finance: 0, legal: 5 }
            }
        ]
    },
    'holding_statement': {
        id: 'holding_statement',
        title: 'Media Pressures for More',
        description: 'The fact-based statement slows the spread, but investigative journalists are asking for specific maintenance logs of the aircraft mentioned in the video.',
        options: [
            {
                text: 'Release redacted maintenance logs to selected, friendly journalists.',
                nextNodeId: 'release_logs',
                impact: { reputation: 15, finance: 5, legal: 10 }
            },
            {
                text: 'Decline to provide logs, citing corporate confidentiality.',
                nextNodeId: 'decline_logs',
                impact: { reputation: -15, finance: -5, legal: 0 }
            }
        ]
    },
    'ignore_video': {
        id: 'ignore_video',
        title: 'Silence is Deafening',
        description: 'Without a counter-narrative, the public assumes guilt. Bookings drop by 8% over the weekend. A consumer rights NGO has lodged a formal complaint with the transport authority.',
        options: [
            {
                text: 'Acknowledge the drop and finally issue a statement.',
                nextNodeId: 'holding_statement',
                impact: { reputation: -10, finance: -5, legal: 0 }
            },
            {
                text: 'Launch a massive discount sale to recover bookings.',
                nextNodeId: 'discount_sale',
                impact: { reputation: -20, finance: -15, legal: -5 }
            }
        ]
    },
    'lawsuit': {
        id: 'lawsuit',
        isTerminal: true,
        title: 'Protracted Legal Battle',
        description: 'The lawsuit drags on for months. While you may eventually win legally, the brand damage is immense, and legal fees mount.',
        options: [],
        terminalMessage: 'Crisis poorly managed. High reputational and financial cost.'
    },
    'apologize': {
        id: 'apologize',
        isTerminal: true,
        title: 'Humbling Recovery',
        description: 'The apology stops the bleeding. The public appreciates the transparency, but it takes time to rebuild trust after the aggressive misstep.',
        options: [],
        terminalMessage: 'Crisis contained, but with unnecessary initial damage.'
    },
    'release_logs': {
        id: 'release_logs',
        isTerminal: true,
        title: 'Transparency Wins',
        description: 'The journalists verify the logs, effectively debunking the influencer\'s claims. The influencer loses credibility, and AeroMY is praised for its transparency.',
        options: [],
        terminalMessage: 'Crisis successfully averted. Reputation enhanced.'
    },
    'decline_logs': {
        id: 'decline_logs',
        isTerminal: true,
        title: 'Suspicion Deepens',
        description: 'Refusal to share logs looks like a cover-up. Regulatory bodies announce an official audit of AeroMY\'s maintenance procedures.',
        options: [],
        terminalMessage: 'Crisis escalated to regulatory intervention.'
    },
    'discount_sale': {
        id: 'discount_sale',
        isTerminal: true,
        title: 'Desperation Perceived',
        description: 'The sale is seen as a desperate attempt to buy back goodwill without addressing the safety concerns. It fails to restore trust and hurts margins.',
        options: [],
        terminalMessage: 'Crisis mishandled. Brand equity significantly eroded.'
    }
};

const CrisisSimulator: React.FC<CrisisSimulatorProps> = ({ activeWorkspace, currentUser }) => {
    const [currentNodeId, setCurrentNodeId] = useState<NodeId>('start');
    const [history, setHistory] = useState<{ node: SimulationNode; selectedOptionText: string }[]>([]);
    const [metrics, setMetrics] = useState({ reputation: 50, finance: 50, legal: 50 });
    const [isExporting, setIsExporting] = useState(false);

    const currentNode = crisisNodes[currentNodeId];

    const handleOptionSelect = (option: SimulationNode['options'][0]) => {
        setHistory([...history, { node: currentNode, selectedOptionText: option.text }]);
        setMetrics({
            reputation: Math.max(0, Math.min(100, metrics.reputation + option.impact.reputation)),
            finance: Math.max(0, Math.min(100, metrics.finance + option.impact.finance)),
            legal: Math.max(0, Math.min(100, metrics.legal + option.impact.legal))
        });
        setCurrentNodeId(option.nextNodeId);
    };

    const handleReset = () => {
        setCurrentNodeId('start');
        setHistory([]);
        setMetrics({ reputation: 50, finance: 50, legal: 50 });
    };

    const handleExportPdf = async () => {
        setIsExporting(true);
        await new Promise(resolve => setTimeout(resolve, 50));
        await exportElementAsPDF('simulator-content', 'Escalate-Crisis-Simulation-Report');
        setIsExporting(false);
    };

    const renderProgressBar = (value: number, colorClass: string, label: string) => (
        <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-600 uppercase">{label}</span>
                <span className="font-bold text-slate-800">{value}/100</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all duration-500 ${colorClass}`} style={{ width: `${value}%` }}></div>
            </div>
        </div>
    );

    return (
        <div className="fade-in pb-12">
            <Header title="Interactive Crisis Simulator" subtitle="Train your team with branching 'choose-your-own-adventure' crisis response modules." />

            <div id="simulator-content" className="space-y-6">
                {/* Metrics Dashboard */}
                <Card className="bg-slate-50 border-slate-200">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Corporate Health Metrics</h3>
                    <div className="flex flex-col md:flex-row gap-6">
                        {renderProgressBar(metrics.reputation, metrics.reputation > 60 ? 'bg-green-500' : metrics.reputation > 30 ? 'bg-amber-500' : 'bg-red-500', 'Brand Reputation')}
                        {renderProgressBar(metrics.finance, metrics.finance > 60 ? 'bg-blue-500' : metrics.finance > 30 ? 'bg-indigo-500' : 'bg-rose-500', 'Financial Stability')}
                        {renderProgressBar(metrics.legal, metrics.legal > 60 ? 'bg-purple-500' : metrics.legal > 30 ? 'bg-pink-500' : 'bg-orange-500', 'Legal/Regulatory Standing')}
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Simulation Panel */}
                    <div className="lg:col-span-2">
                        <Card className="h-full flex flex-col border-indigo-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
                            
                            <div className="mb-6 flex-grow">
                                <span className="inline-block px-2.5 py-1 bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
                                    {currentNode.isTerminal ? 'Simulation Concluded' : 'Active Scenario'}
                                </span>
                                <h2 className="text-2xl font-bold text-slate-900 mb-3">{currentNode.title}</h2>
                                <p className="text-slate-700 leading-relaxed text-lg">{currentNode.description}</p>
                            </div>

                            {!currentNode.isTerminal ? (
                                <div className="space-y-3 mt-4">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Response Strategy:</h4>
                                    {currentNode.options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionSelect(option)}
                                            className="w-full text-left p-4 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm transition-all group flex items-center justify-between"
                                        >
                                            <span className="font-medium text-slate-700 group-hover:text-indigo-900">{option.text}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-6 p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">Simulation Outcome</h3>
                                    <p className="text-slate-600 font-medium mb-6">{currentNode.terminalMessage}</p>
                                    
                                    <div className="flex justify-center gap-4">
                                        <button onClick={handleReset} className="btn bg-white border border-slate-300 text-slate-700 hover:bg-slate-50">
                                            Restart Simulation
                                        </button>
                                        <button onClick={handleExportPdf} disabled={isExporting} className="btn btn-primary print-hidden">
                                            {isExporting ? 'Generating Report...' : 'Export Post-Mortem Report'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* History Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="h-full bg-white border-slate-200">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider border-b border-slate-100 pb-2">Decision Log</h3>
                            
                            {history.length === 0 ? (
                                <p className="text-sm text-slate-500 italic text-center py-8">Simulation just started. Decisions will be logged here.</p>
                            ) : (
                                <div className="space-y-6">
                                    {history.map((step, idx) => (
                                        <div key={idx} className="relative pl-6 border-l-2 border-indigo-100 last:border-l-transparent">
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-50 border-2 border-indigo-400"></div>
                                            <div className="mb-1">
                                                <span className="text-xs font-bold text-indigo-600 uppercase">Step {idx + 1}</span>
                                                <h4 className="text-sm font-bold text-slate-800">{step.node.title}</h4>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
                                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Action Taken:</p>
                                                <p className="text-sm text-slate-700 italic">"{step.selectedOptionText}"</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="relative pl-6">
                                         <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-slate-300"></div>
                                         <span className="text-xs font-bold text-slate-500 uppercase">Current Status</span>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrisisSimulator;
