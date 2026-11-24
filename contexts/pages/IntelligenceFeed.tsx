import * as React from 'react';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import { fetchIntelligenceFeed } from '../../services/aiService.ts';
import { IntelligenceItem, Workspace, User } from '../../types.ts';

interface IntelligenceFeedProps {
    activeWorkspace: Workspace;
    currentUser: User;
}

const ItemCard: React.FC<{ item: IntelligenceItem }> = ({ item }) => {
    const sentimentColors = {
        Positive: 'border-l-green-500',
        Neutral: 'border-l-slate-400',
        Negative: 'border-l-red-500',
    };
    
    let hostname = "source";
    try {
        if (item.url) {
            hostname = new URL(item.url).hostname.replace('www.', '');
        }
    } catch (e) { /* ignore invalid URLs */ }

    return (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="block group">
            <Card className={`h-full flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl hover:border-amber-500/50 hover:-translate-y-1 !p-4 border-l-4 ${sentimentColors[item.sentiment]}`}>
                <div className="flex items-center mb-2">
                    <img 
                        src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`} 
                        alt={`${hostname} favicon`}
                        className="w-5 h-5 mr-2 rounded-sm flex-shrink-0 bg-slate-200"
                     />
                    <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">{item.source}</p>
                    <span className="text-xs text-slate-400 mx-2">&bull;</span>
                    <p className="text-xs text-slate-500 truncate">{item.author}</p>
                </div>
                <h3 className="text-base font-bold text-slate-800 group-hover:text-amber-600 transition-colors flex-grow">
                    {item.content}
                </h3>
                {item.summary && <p className="text-sm text-slate-600 mt-2 line-clamp-2">{item.summary}</p>}
                <div className="mt-auto pt-3 flex justify-between items-center text-xs text-slate-500">
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                    {item.reach != null && <span>Reach: {item.reach.toLocaleString()}</span>}
                </div>
            </Card>
        </a>
    );
}

const IntelligenceFeed: React.FC<IntelligenceFeedProps> = ({ activeWorkspace, currentUser }) => {
    const [feed, setFeed] = React.useState<IntelligenceItem[] | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [filters, setFilters] = React.useState({ type: 'All' as 'All' | 'News' | 'Social', keyword: '' });

    const loadFeed = React.useCallback(async (forceRefresh = false) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchIntelligenceFeed(activeWorkspace, filters, { forceRefresh, userPersona: currentUser.persona }, currentUser.persona.aiEngine);
            setFeed(result);
        } catch (err) {
            setError("An error occurred while fetching the intelligence feed.");
        } finally {
            setIsLoading(false);
        }
    }, [activeWorkspace, filters, currentUser]);

    React.useEffect(() => {
        loadFeed();
    }, [loadFeed]);

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };
    
    const inputClass = "p-2 border rounded-md bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-amber-500 focus:border-amber-500";


    return (
        <div className="fade-in">
            <Header title="The Signal Stream" subtitle="A unified, real-time flow of news and social media intelligence, tuned to your strategic priorities." />
            
            <Card className="mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <input
                        type="text"
                        value={filters.keyword}
                        onChange={e => handleFilterChange('keyword', e.target.value)}
                        placeholder="Filter by keyword..."
                        className={`flex-grow ${inputClass}`}
                        onKeyUp={e => e.key === 'Enter' && loadFeed()}
                    />
                    <select
                        value={filters.type}
                        onChange={e => handleFilterChange('type', e.target.value)}
                        className={inputClass}
                    >
                        <option value="All">All Sources</option>
                        <option value="News">News Only</option>
                        <option value="Social">Social Only</option>
                    </select>
                    <button onClick={() => loadFeed()} disabled={isLoading} className="btn btn-primary">
                        {isLoading ? 'Filtering...' : 'Apply Filters'}
                    </button>
                </div>
            </Card>
            
            {isLoading && <div className="py-20"><LoadingSpinner /></div>}
            {error && <p className="text-center text-red-600 mt-8">{error}</p>}

            {!isLoading && feed && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 fade-in">
                    {feed.map((item, index) => <ItemCard key={item.url || index} item={item} />)}
                </div>
            )}

            {!isLoading && (!feed || feed.length === 0) && (
                <Card><p className="text-center py-10 text-slate-500">No items found matching your criteria.</p></Card>
            )}
        </div>
    );
};

export default IntelligenceFeed;