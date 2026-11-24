import React, { useEffect, useState } from 'react';

interface RssItem {
  title: string;
  pubDate: string;
  link: string;
}

export default function LiveIndustryWire({ className = '' }: { className?: string }) {
  const [news, setNews] = useState<RssItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNews(data); 
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('RSS Fetch Error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-2"></span>
          Live Industry Wire
        </h3>
        <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded">Google News</span>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-sm text-slate-500 animate-pulse">Establishing live connection...</div>
        ) : news.length > 0 ? (
          news.map((item, index) => (
            <div key={index} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors line-clamp-2"
              >
                {item.title}
              </a>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(item.pubDate).toLocaleDateString('en-MY', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-500">Live feed currently unavailable.</div>
        )}
      </div>
    </div>
  );
}
