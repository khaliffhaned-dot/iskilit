import * as React from 'react';
import { GroundedNews } from '../types.ts';

interface SourceCardProps {
  source: GroundedNews;
}

const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
    let hostname = "source";
    try {
        if (source.uri) {
            hostname = new URL(source.uri).hostname.replace('www.', '');
        }
    } catch (e) { /* ignore invalid URLs */ }

    return (
        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="block bg-slate-100/60 backdrop-blur-md hover:bg-slate-200/60 p-3 rounded-lg transition-colors border border-slate-200/50 hover:border-slate-300/80">
            <div className="flex items-center">
                <img 
                    src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`} 
                    alt="favicon" 
                    className="w-6 h-6 mr-3 rounded-sm flex-shrink-0 bg-slate-300"
                    onError={(e) => { 
                        e.currentTarget.onerror = null; 
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                    }}
                />
                 <div style={{ display: 'none' }} className="w-6 h-6 mr-3 rounded-sm flex-shrink-0 bg-slate-300 items-center justify-center text-xs text-slate-600 font-bold">
                    {hostname.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                     <p className="font-semibold text-amber-600 hover:text-amber-500 truncate text-sm">{source.title || "Untitled Source"}</p>
                     <p className="text-xs text-slate-500 truncate">{hostname}</p>
                </div>
            </div>
        </a>
    )
}

export default SourceCard;