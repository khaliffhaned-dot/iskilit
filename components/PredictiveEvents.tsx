import React from 'react';
import Card from './Card';
import { PredictiveEvent } from '../types';
import { Calendar, AlertTriangle } from 'lucide-react';

export const PredictiveEvents: React.FC<{ events: PredictiveEvent[], className?: string }> = ({ events, className = '' }) => {
    return (
        <Card title="Upcoming Narrative Risks & Opportunities" className={`card-color-3 ${className}`}>
            {events.length === 0 ? (
                <p className="text-slate-500">No predictive events identified.</p>
            ) : (
                <div className="space-y-4">
                    {events.map(event => (
                        <div key={event.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-start gap-3">
                            <div className="mt-1">
                                {event.actionRequired ? <AlertTriangle size={18} className="text-amber-600" /> : <Calendar size={18} className="text-slate-400" />}
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">{event.title}</p>
                                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                                    {event.date} 
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${Math.round(event.probability * 100) > 80 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {Math.round(event.probability * 100)}% Probability
                                    </span>
                                </p>
                                <p className="text-sm text-slate-600 mt-1">{event.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};
