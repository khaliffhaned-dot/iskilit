import React, { useState, useMemo } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import EmptyState from '../../components/EmptyState.tsx';
import { exportElementAsPDF } from '../../services/exportService.ts';
import { Workspace, UserContext, Stakeholder2 } from '../../types.ts';
import { mockStakeholders2 } from '../../services/malaysianMockData.ts';

interface StakeholderMappingProps {
    activeWorkspace: Workspace;
    currentUser: UserContext;
}

const CATEGORY_COLORS: Record<string, string> = {
  Media: '#3b82f6',      // blue-500
  Government: '#8b5cf6', // violet-500
  NGO: '#10b981',        // emerald-500
  Corporate: '#f59e0b',  // amber-500
  'Key Opinion Leader': '#ec4899', // pink-500
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data: Stakeholder2 = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg z-50">
        <p className="font-bold text-slate-800">{data.name}</p>
        <p className="text-xs text-slate-500 mb-2">{data.role} - {data.organization}</p>
        <span className="inline-block px-2 py-1 bg-slate-100 text-xs font-semibold rounded-full mb-2" style={{ color: CATEGORY_COLORS[data.category] || '#64748b' }}>
            {data.category}
        </span>
        <div className="grid grid-cols-2 gap-4 text-sm mt-2 pt-2 border-t border-slate-100">
            <div>
                <p className="text-slate-500 text-xs">Influence</p>
                <p className="font-bold">{data.influenceScore}</p>
            </div>
            <div>
                <p className="text-slate-500 text-xs">Stance</p>
                <p className="font-bold">{data.stanceScore}</p>
            </div>
        </div>
      </div>
    );
  }
  return null;
};

const StakeholderMapping: React.FC<StakeholderMappingProps> = ({ activeWorkspace, currentUser }) => {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<Stakeholder2[] | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [isExporting, setIsExporting] = useState(false);

    const handleAnalyze = async () => {
        if (!topic.trim()) return;
        setIsLoading(true);
        // Simulate API call and use the mock data designed for scatter plot
        setTimeout(() => {
            setData(mockStakeholders2 as Stakeholder2[]);
            setIsLoading(false);
        }, 1500);
    };

    const handleExportPdf = async () => {
        if (isExporting || !data) return;
        setIsExporting(true);
        await new Promise(resolve => setTimeout(resolve, 50));
        await exportElementAsPDF('report-content', `Escalate-Stakeholder-Map`);
        setIsExporting(false);
    };

    const filteredData = useMemo(() => {
        if (!data) return [];
        if (selectedCategory === 'All') return data;
        return data.filter(s => s.category === selectedCategory);
    }, [data, selectedCategory]);

    const categories = useMemo(() => {
        if (!data) return [];
        const cats = new Set(data.map(d => d.category));
        return ['All', ...Array.from(cats)];
    }, [data]);

    return (
        <div className="fade-in pb-12">
            <Header title="Stakeholder Influence Cartography" subtitle="Visualize the ecosystem. Map influence vs. stance on a four-quadrant matrix." />
            
            <Card className="mb-8">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-grow w-full space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {['Launch of a new manufacturing plant in Selangor', 'Proposed digital privacy law changes', 'Public reaction to company sustainability report', 'Potential crisis involving supply chain ethics'].map(option => (
                                <button 
                                    key={option}
                                    onClick={() => setTopic(option)}
                                    className={`p-3 rounded-lg border text-left transition-all ${topic === option ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-500' : 'bg-white border-slate-300 hover:border-amber-400'}`}
                                >
                                    <p className="font-semibold text-slate-800">{option}</p>
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                                placeholder="Or enter a custom issue/scenario"
                                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-800"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || !topic.trim()}
                        className="btn btn-primary w-full sm:w-auto whitespace-nowrap"
                    >
                        {isLoading ? 'Mapping...' : 'Generate Map'}
                    </button>
                </div>
            </Card>

            <div id="report-content">
                {isLoading && <div className="py-20"><LoadingSpinner /></div>}
                
                {data && !isLoading && (
                    <Card>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">The Influence Matrix</h2>
                                <p className="text-sm text-slate-500">Mapping structural power against stance for: "{topic}"</p>
                            </div>
                            <button onClick={handleExportPdf} disabled={isExporting} className="btn btn-secondary text-sm print-hidden">
                                {isExporting ? 'Saving...' : 'Save PDF'}
                            </button>
                        </div>
                        
                        <div className="flex gap-2 mb-6 flex-wrap">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                                        selectedCategory === cat 
                                        ? 'bg-slate-800 text-white border-slate-800' 
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full h-[500px] bg-slate-50 rounded-xl border border-slate-200 p-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis 
                                        type="number" 
                                        dataKey="stanceScore" 
                                        name="Stance" 
                                        domain={[-100, 100]} 
                                        tickFormatter={(val) => val === -100 ? 'Detractor' : val === 100 ? 'Promoter' : val}
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        stroke="#cbd5e1"
                                    />
                                    <YAxis 
                                        type="number" 
                                        dataKey="influenceScore" 
                                        name="Influence" 
                                        domain={[0, 100]} 
                                        tickFormatter={(val) => val === 0 ? 'Low' : val === 100 ? 'High' : val}
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        stroke="#cbd5e1"
                                    />
                                    <ZAxis type="number" range={[200, 200]} />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                                    <ReferenceLine y={50} stroke="#94a3b8" strokeDasharray="3 3" />
                                    <ReferenceLine x={0} stroke="#94a3b8" strokeDasharray="3 3" />
                                    
                                    <Scatter name="Stakeholders" data={filteredData}>
                                        {filteredData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category] || '#94a3b8'} />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                            
                            {/* Quadrant Labels */}
                            <div className="absolute top-8 right-8 text-xs font-bold text-slate-400 uppercase tracking-widest pointer-events-none">Promoters</div>
                            <div className="absolute top-8 left-16 text-xs font-bold text-slate-400 uppercase tracking-widest pointer-events-none">Threats</div>
                            <div className="absolute bottom-16 right-8 text-xs font-bold text-slate-400 uppercase tracking-widest pointer-events-none">Latent Allies</div>
                            <div className="absolute bottom-16 left-16 text-xs font-bold text-slate-400 uppercase tracking-widest pointer-events-none">Marginal Detractors</div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredData.map(s => (
                                <div key={s.id} className="p-4 border border-slate-200 rounded-lg bg-white flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-800 line-clamp-1">{s.name}</h4>
                                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[s.category] || '#94a3b8' }}></span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-1">{s.role}</p>
                                    <p className="text-xs font-medium text-slate-600 mb-4">{s.organization}</p>
                                    
                                    <div className="mt-auto space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500">Influence:</span>
                                            <span className="font-bold text-slate-800">{s.influenceScore}/100</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500">Stance:</span>
                                            <span className="font-bold text-slate-800">{s.stanceScore > 0 ? '+' : ''}{s.stanceScore}</span>
                                        </div>
                                        <div className="pt-2 mt-2 border-t border-slate-100 flex justify-between items-center">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status</span>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                                                s.engagementStatus === 'Requires Immediate Action' ? 'bg-red-50 text-red-600' :
                                                s.engagementStatus === 'Engaged' ? 'bg-green-50 text-green-600' :
                                                'bg-amber-50 text-amber-600'
                                            }`}>{s.engagementStatus}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {!isLoading && !data && (
                    <EmptyState
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                        title="Map Stakeholders"
                        message="Enter an issue or scenario above to generate an influence vs. stance matrix."
                    />
                )}
            </div>
        </div>
    );
};

export default StakeholderMapping;
