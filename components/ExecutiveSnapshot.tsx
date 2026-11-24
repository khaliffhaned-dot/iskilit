import React from 'react';

export const ExecutiveSnapshot: React.FC<{ summary: string }> = ({ summary }) => {
    return (
        <div className="bg-slate-900/85 backdrop-blur-md text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-[0_12px_40px_-15px_rgba(15,23,42,0.3)] hover:border-slate-700/80 transition-all duration-300 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <span className="text-amber-400 animate-pulse">⚡</span> AI Executive Snapshot
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm font-inter">{summary}</p>
        </div>
    );
};
