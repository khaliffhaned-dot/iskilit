import React from 'react';
import Card from './Card';
import { Stakeholder } from '../types';

const mockStakeholders: Stakeholder[] = [
    { id: '1', name: 'Regulator Body X', role: 'Regulatory', influence: 'High', interest: 'High', sentiment: 'Neutral' },
    { id: '2', name: 'Key Opinion Leader Y', role: 'Influencer', influence: 'High', interest: 'Medium', sentiment: 'Positive' },
    { id: '3', name: 'Competitor Z', role: 'Industry', influence: 'Medium', interest: 'High', sentiment: 'Negative' },
];

export const StakeholderMapping: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <Card title="Automated Stakeholder Mapping" className={`card-color-3 ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                        <tr>
                            <th className="px-3 py-2">Name</th>
                            <th className="px-3 py-2">Influence</th>
                            <th className="px-3 py-2">Interest</th>
                            <th className="px-3 py-2">Sentiment</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {mockStakeholders.map(s => (
                            <tr key={s.id}>
                                <td className="px-3 py-2 font-medium text-slate-800">{s.name}</td>
                                <td className="px-3 py-2">{s.influence}</td>
                                <td className="px-3 py-2">{s.interest}</td>
                                <td className="px-3 py-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.sentiment === 'Positive' ? 'bg-green-100 text-green-700' : s.sentiment === 'Negative' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                                        {s.sentiment}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
