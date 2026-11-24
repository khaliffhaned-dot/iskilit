import React, { useState } from 'react';
import Card from './Card';
import { ContentRiskAlert } from '../types';

const generateDraft = (vector: string) => `DRAFT HOLDING STATEMENT: We are aware of the reports regarding ${vector.toLowerCase()} and are currently investigating. We will provide updates as soon as more information is available. Our commitment to safety and transparency remains our top priority.`;

export const RecentAlerts: React.FC<{ alerts: ContentRiskAlert[], className?: string }> = ({ alerts, className = '' }) => {
    const [draftingAlert, setDraftingAlert] = useState<{id: string, text: string} | null>(null);
    const mockAlerts = alerts.length > 0 ? alerts : [
        { id: 'a1', vector: 'Audio Leak', snippet: 'Unverified deepfake audio circulating in Telegram groups regarding CEO conduct.', threatLevel: 'Critical' },
        { id: 'a2', vector: 'Bot Activity', snippet: 'Coordinated negative sentiment spikes originating from anomalous IPs.', threatLevel: 'Critical' },
        { id: 'a3', vector: 'Press Inaccuracy', snippet: 'Leading news outlet misquoting sustainability report projections.', threatLevel: 'Moderate' },
    ];
    return (
        <Card 
            title="Recent Content Risk Alerts" 
            className={`${className} flex flex-col justify-between`}
            titleClassName="!text-sm !font-bold !tracking-wider !text-slate-500 !uppercase !mb-4"
        >
            <div className="space-y-2.5 flex-grow overflow-y-auto pr-1">
                {mockAlerts.map(alert => (
                    <div key={alert.id} className="p-3 bg-slate-50/50 rounded-lg border border-slate-200/60 shadow-sm">
                        {draftingAlert?.id === alert.id ? (
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-slate-800">Drafting response for: {alert.vector}</p>
                                <textarea 
                                    className="w-full h-20 p-2 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" 
                                    value={draftingAlert.text}
                                    onChange={(e) => setDraftingAlert({...draftingAlert, text: e.target.value})}
                                />
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => setDraftingAlert(null)} className="text-[10px] bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold">Cancel</button>
                                    <button onClick={() => setDraftingAlert(null)} className="text-[10px] bg-emerald-600 text-white px-2 py-1 rounded font-bold">Save Draft</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <p className="font-extrabold text-slate-800 text-xs tracking-tight">{alert.vector}</p>
                                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{alert.snippet}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${alert.threatLevel === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {alert.threatLevel}
                                    </span>
                                    <button 
                                        onClick={() => setDraftingAlert({id: alert.id, text: generateDraft(alert.vector)})}
                                        className="text-[10px] bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1 rounded-lg font-bold shadow-sm transition-all duration-200">
                                        Draft Response
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};

