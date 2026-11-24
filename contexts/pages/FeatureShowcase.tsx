import React, { useState } from 'react';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import { NAV_SEGMENTS } from '../../constants.tsx';
import { NavItem } from '../../types.ts';

const FeatureCard: React.FC<{ item: NavItem, colorClass: string }> = ({ item, colorClass }) => (
    <div className={`${colorClass} p-4 rounded-lg border border-slate-200/50 flex items-start gap-4 h-full`}>
        <span className="text-amber-600 mt-1">{React.cloneElement(item.icon, { className: 'h-6 w-6 flex-shrink-0' })}</span>
        <div>
            <h4 className="font-bold text-slate-800">{item.displayName || item.name}</h4>
            <p className="text-sm text-slate-500 mt-1">{item.description}</p>
        </div>
    </div>
);

const FeatureShowcase: React.FC = () => {
    const [copyStatus, setCopyStatus] = useState('Copy Shareable Link');
    const cardColors = ['card-color-1', 'card-color-2', 'card-color-3', 'card-color-4', 'card-color-5', 'card-color-6'];
    let featureCounter = 0;

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setCopyStatus('Link Copied!');
            setTimeout(() => setCopyStatus('Copy Shareable Link'), 2000);
        }).catch(() => {
            setCopyStatus('Failed to copy');
            setTimeout(() => setCopyStatus('Copy Shareable Link'), 2000);
        });
    };

    return (
        <div className="fade-in">
            <Header title="The Escalate Arsenal" subtitle="A complete overview of the strategic capabilities available in your IMC Command Center." />

            <div className="flex justify-end mb-6">
                 <button 
                    onClick={handleCopyLink} 
                    className="btn btn-secondary"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    {copyStatus}
                </button>
            </div>

            <div className="space-y-8">
                {NAV_SEGMENTS.map(segment => (
                    <Card key={segment.title}>
                        <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-xl font-bold text-slate-800">{segment.title}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {segment.items.map(item => (
                                <FeatureCard key={item.name as string} item={item} colorClass={cardColors[featureCounter++ % cardColors.length]} />
                            ))}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FeatureShowcase;