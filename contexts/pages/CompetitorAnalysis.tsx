import * as React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, XAxis, YAxis, Bar, CartesianGrid } from 'recharts';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import { generateCompetitiveAnalysis } from '../../services/aiService.ts';
import { CompetitiveAnalysisReport, ShareDataPoint, User, Workspace } from '../../types.ts';
import { exportElementAsPDF } from '../../services/exportService.ts';

interface CompetitorAnalysisProps {
  payload?: any;
  activeWorkspace: Workspace;
  currentUser: User;
}

const PIE_COLORS = ['#f59e0b', '#ef4444', '#10b981', '#a855f7', '#3b82f6', '#64748b'];

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border border-slate-200 rounded-lg shadow-lg">
                <p className="font-bold text-slate-800">{`${payload[0].name} : ${payload[0].value.toFixed(1)}%`}</p>
            </div>
        );
    }
    return null;
};

const ShareOfVoiceChart: React.FC<{ data: ShareDataPoint[] }> = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
        <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} fill="#8884d8" paddingAngle={5}>
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#475569' }} iconType="circle" />
        </PieChart>
    </ResponsiveContainer>
);

const NarrativeDominanceChart: React.FC<{ data: ShareDataPoint[] }> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" unit="%" stroke="#64748b" />
                <YAxis dataKey="name" type="category" width={80} stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Bar dataKey="value" name="Narrative Dominance" fill="#8884d8">
                     {data.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ payload, activeWorkspace, currentUser }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [report, setReport] = React.useState<CompetitiveAnalysisReport | null>(null);
    const [isExporting, setIsExporting] = React.useState(false);

    const yourBrand = activeWorkspace.brandName;
    const competitors = activeWorkspace.competitors.join(', ');

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        setReport(null);
        try {
            const result = await generateCompetitiveAnalysis(activeWorkspace.id, yourBrand, activeWorkspace.competitors, currentUser.persona, currentUser.persona.aiEngine);
            if(result) {
                setReport(result);
            } else {
                setError('Failed to generate the analysis. The AI service may have returned an empty response.');
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportPdf = async () => {
        if(isExporting || !report) return;
        setIsExporting(true);
        await new Promise(resolve => setTimeout(resolve, 50));
        const fileName = `Escalate-Competitive-Intelligence-${yourBrand}-${new Date().toISOString().split('T')[0]}`;
        await exportElementAsPDF('report-content', fileName);
        setIsExporting(false);
    };
    
    const inputClass = "w-full bg-slate-100 border border-slate-300 rounded-lg px-4 py-2 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500";
    const labelClass = "block text-sm font-medium text-slate-600 mb-1";

    return (
        <div className="fade-in">
            <Header title="Decoding the Competitive Matrix" subtitle="Gain a decisive edge by analyzing competitor share of voice, narrative dominance, and strategic positioning." />
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className={labelClass}>Your Brand (from Workspace)</label>
                        <input type="text" value={yourBrand} disabled className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Competitors (from Workspace)</label>
                        <input type="text" value={competitors} disabled className={inputClass} />
                    </div>
                </div>
                <div className="flex justify-end items-center">
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        className="btn btn-primary"
                    >
                        {isLoading ? 'Analyzing...' : 'Generate Analysis'}
                    </button>
                </div>
            </Card>

            {error && <p className="text-center text-red-600 mt-8">{error}</p>}
            {isLoading && <div className="py-20"><LoadingSpinner /></div>}

            {report && !isLoading && (
                <div id="report-content">
                    <Card className="mt-8 fade-in">
                         <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-slate-800">Competitive Intelligence Report</h3>
                            <button onClick={handleExportPdf} disabled={isExporting} className="btn btn-secondary print-hidden text-sm">
                                {isExporting ? 'Saving...' : 'Save as PDF'}
                            </button>
                        </div>
                        <div className="space-y-8">
                            <p className="text-slate-600">{report.summary}</p>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <Card title="Share of Voice" className="card-color-1"><ShareOfVoiceChart data={report.shareOfVoice || []} /></Card>
                                <Card title="Narrative Dominance" className="card-color-2"><NarrativeDominanceChart data={report.narrativeDominance || []} /></Card>
                            </div>
                            <Card title="Brand Positioning Analysis" className="card-color-3">
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {(report.brandAnalyses || []).map(brand => (
                                        <Card key={brand.brandName} title={brand.brandName} className="!bg-white/50">
                                            <div>
                                                <h5 className="font-semibold text-amber-600">Positioning</h5>
                                                <p className="text-slate-600 text-sm">{brand.positioning}</p>
                                            </div>
                                             <div className="mt-2">
                                                 <h5 className="font-semibold text-amber-600">Key Themes</h5>
                                                 <ul className="list-disc list-inside text-slate-600 text-sm">
                                                    {(brand.keyThemes || []).map((theme, i) => <li key={i}>{theme}</li>)}
                                                 </ul>
                                            </div>
                                        </Card>
                                    ))}
                                 </div>
                            </Card>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default CompetitorAnalysis;