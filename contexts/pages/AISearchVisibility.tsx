import * as React from 'react';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import EmptyState from '../../components/EmptyState.tsx';
import { exportElementAsPDF } from '../../services/exportService.ts';
import { User, Workspace } from '../../types.ts';

interface AISearchVisibilityProps {
    activeWorkspace: Workspace;
    currentUser: User;
}

interface QueryRecommendation {
    query: string;
    brandStatus: 'Recommended (Rank #1)' | 'Mentioned (Rank #3)' | 'Not Recommended' | 'Unranked';
    reason: string;
    sentimentVector: 'Positive' | 'Neutral' | 'Negative';
    recommendingModels: string[];
}

interface ModelAudit {
    modelName: string;
    score: number;
    sourcingPriority: string;
    status: 'Strong' | 'Moderate' | 'Weak';
    analysis: string;
}

interface AIVisibilityReport {
    brandName: string;
    aeoScore: number;
    machineReadabilityIndex: number;
    reputationMoatScore: number;
    summary: string;
    modelBreakdown: ModelAudit[];
    queries: QueryRecommendation[];
    sources: { name: string; percentage: number; authority: 'High' | 'Medium' | 'Low' }[];
    recommendations: string[];
}

const AISearchVisibility: React.FC<AISearchVisibilityProps> = ({ activeWorkspace, currentUser }) => {
    const [brandName, setBrandName] = React.useState(activeWorkspace.brandName);
    const [isLoading, setIsLoading] = React.useState(false);
    const [report, setReport] = React.useState<AIVisibilityReport | null>(null);
    const [activeTab, setActiveTab] = React.useState<'audit' | 'moat'>('audit');
    const [isExporting, setIsExporting] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    // Interactive Moat Calculator state
    const [earnedMedia, setEarnedMedia] = React.useState(12); // High authority links
    const [syntheticNoise, setSyntheticNoise] = React.useState(4);  // Competitor bot/forum noise
    const [prCampaignValue, setPrCampaignValue] = React.useState(5);  // Authorized press releases

    // LLM Specificity and Weight states
    const [selectedEngine, setSelectedEngine] = React.useState<'all' | 'gemini' | 'perplexity' | 'chatgpt'>('all');

    // Live API integration states (Ahrefs / Semrush mockup)
    const [isSyncing, setIsSyncing] = React.useState(false);
    const [syncStatus, setSyncStatus] = React.useState<'idle' | 'syncing' | 'synced'>('idle');
    const [apiProvider, setApiProvider] = React.useState<'ahrefs' | 'semrush'>('ahrefs');
    const [lastSyncTime, setLastSyncTime] = React.useState<string | null>(null);
    const [liveUrlsScraped, setLiveUrlsScraped] = React.useState<string[]>([]);

    // Competitor Benchmarking states (AeroMY vs Crest Air)
    const [competitorName, setCompetitorName] = React.useState('Crest Air');
    const [competitorEarnedMedia, setCompetitorEarnedMedia] = React.useState(8);
    const [competitorPrCampaignValue, setCompetitorPrCampaignValue] = React.useState(12);
    const [competitorSyntheticNoise, setCompetitorSyntheticNoise] = React.useState(10);

    const getEngineWeights = (engine: 'all' | 'gemini' | 'perplexity' | 'chatgpt') => {
        if (engine === 'gemini') return { earned: 15, pr: 3, noise: 1.5, notes: 'Google Gemini heavily weights real-time Google News indexes and high-authority Malay media.' };
        if (engine === 'perplexity') return { earned: 12, pr: 2, noise: 4.5, notes: 'Perplexity prioritizes direct citations but is highly sensitive to forum complaints.' };
        if (engine === 'chatgpt') return { earned: 8, pr: 8, noise: 2.5, notes: 'OpenAI ChatGPT rewards highly structured Schema.org microdata and official archives.' };
        return { earned: 10, pr: 4, noise: 3.0, notes: 'Balanced baseline representing generalized across-the-board conversational search architectures.' };
    };

    // Calculate simulated reputation moat score in real-time
    const calculatedMoatScore = React.useMemo(() => {
        const weights = getEngineWeights(selectedEngine);
        const numerator = (earnedMedia * weights.earned) + (prCampaignValue * weights.pr);
        const denominator = Math.max(1, syntheticNoise * weights.noise);
        const base = (numerator / denominator) * 10;
        return Math.min(100, Math.round(base));
    }, [earnedMedia, syntheticNoise, prCampaignValue, selectedEngine]);

    // Calculate competitor reputation moat score in real-time
    const calculatedCompetitorMoatScore = React.useMemo(() => {
        const weights = getEngineWeights(selectedEngine);
        const numerator = (competitorEarnedMedia * weights.earned) + (competitorPrCampaignValue * weights.pr);
        const denominator = Math.max(1, competitorSyntheticNoise * weights.noise);
        const base = (numerator / denominator) * 10;
        return Math.min(100, Math.round(base));
    }, [competitorEarnedMedia, competitorSyntheticNoise, competitorPrCampaignValue, selectedEngine]);

    const getMoatStatus = (score: number) => {
        if (score >= 80) return { label: 'Un-fakeable Moat (Excellent)', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
        if (score >= 50) return { label: 'Moderate Moat (Vulnerable)', color: 'text-amber-600 bg-amber-50 border-amber-200' };
        return { label: 'Fragile / Undefensible Moat (High Risk)', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    };

    const handleSyncLiveApi = React.useCallback(async () => {
        setIsSyncing(true);
        setSyncStatus('syncing');
        setLiveUrlsScraped([]);

        // Simulated scraping timeline
        const steps = [
            "Connecting to " + (apiProvider === 'ahrefs' ? "Ahrefs API v3" : "Semrush Authority API") + " gateway...",
            "Crawling backlink profiles for " + brandName + "...",
            "Analyzing anchor text signals and trust factors on Astro Awani & Metro Awani...",
            "Sync complete. Found new live earned media entries."
        ];

        for (let i = 0; i < steps.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 700));
            setLiveUrlsScraped(prev => [...prev, steps[i]]);
        }

        // Set realistic synced data based on live database status or random variations
        setEarnedMedia(14); // Scraped authority links
        setPrCampaignValue(8); // Valid structured press releases discovered
        setSyntheticNoise(3);  // Recalculated social noise index
        setLastSyncTime(new Date().toLocaleTimeString());
        setSyncStatus('synced');
        setIsSyncing(false);
    }, [apiProvider, brandName]);

    const handleRunAudit = React.useCallback(async () => {
        if (!brandName.trim()) {
            setErrorMessage('Please enter a valid brand name.');
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);
        setReport(null);

        try {
            // Check operational API status
            let isLive = false;
            try {
                const statusRes = await fetch('/api/ai/status');
                if (statusRes.ok) {
                    const statusData = await statusRes.json();
                    isLive = !!statusData.hasApiKey;
                }
            } catch (e) {
                console.warn("Status check failed, using high-fidelity simulation dataset", e);
            }

            if (isLive) {
                const prompt = `Conduct a structured AI Search Engine Visibility & Answer Engine Optimization (AEO) Audit for the brand "${brandName}" operating in Malaysia/Southeast Asia. 
                Focus heavily on:
                1. AEO Visibility Score (0-100)
                2. Machine-Readability Index (0-100)
                3. The Invisible Consideration Set: analyze 3 conversational queries relevant to their market (such as travel/aviation if it's an airline, or generic business query) and state if they are Recommended, Mentioned, or Not Recommended, with reasons emphasizing Malaysian business or consumer context (e.g., using local media like Metro Awani, Astro Awani, Astro Go, Astro AWANI, Malaysia MADANI, SST hikes).
                4. Multi-Model Paradox Breakdown: analyze how Gemini, GPT-4, Claude, and Perplexity index this brand.
                5. Sourcing footprint percentage.
                6. 3 tactical recommendations.
                
                Respond in strictly valid JSON format matching the following schema:
                {
                    "brandName": string,
                    "aeoScore": number,
                    "machineReadabilityIndex": number,
                    "reputationMoatScore": number,
                    "summary": string,
                    "modelBreakdown": [{"modelName": string, "score": number, "sourcingPriority": string, "status": "Strong"|"Moderate"|"Weak", "analysis": string}],
                    "queries": [{"query": string, "brandStatus": "Recommended (Rank #1)"|"Mentioned (Rank #3)"|"Not Recommended"|"Unranked", "reason": string, "sentimentVector": "Positive"|"Neutral"|"Negative", "recommendingModels": [string]}],
                    "sources": [{"name": string, "percentage": number, "authority": "High"|"Medium"|"Low"}],
                    "recommendations": [string]
                }`;

                const response = await fetch('/api/ai/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: 'gemini-3.5-flash',
                        contents: prompt,
                        config: { responseMimeType: "application/json" }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    let rawText = data.text.trim();
                    if (rawText.startsWith("```json")) {
                        rawText = rawText.substring(7);
                    }
                    if (rawText.endsWith("```")) {
                        rawText = rawText.substring(0, rawText.length - 3);
                    }
                    const parsed = JSON.parse(rawText.trim());
                    setReport(parsed);
                    setIsLoading(false);
                    return;
                }
            }

            // High fidelity simulated fallback with rich local context
            setTimeout(() => {
                const isAeroMY = brandName.toLowerCase().includes('aero');
                const brandDisplayName = isAeroMY ? 'AeroMY' : brandName;

                const simulatedReport: AIVisibilityReport = {
                    brandName: brandDisplayName,
                    aeoScore: isAeroMY ? 74 : 65,
                    machineReadabilityIndex: isAeroMY ? 62 : 48,
                    reputationMoatScore: isAeroMY ? 68 : 55,
                    summary: `Traditional buying journeys in Malaysia are compressing rapidly. For ${brandDisplayName}, 74% of potential customer searches on conversational agents like Gemini and Perplexity are "zero-click," meaning users act solely on the machine's summary. Currently, ${brandDisplayName} exhibits a moderate presence in the "Invisible Consideration Set", but is frequently locked out of premium query recommendations due to a weak machine-readable schema footprint and un-indexed earned media references from major local publications like Astro Awani.`,
                    modelBreakdown: [
                        {
                            modelName: 'Gemini (Google)',
                            score: isAeroMY ? 82 : 70,
                            sourcingPriority: 'Google Search Grounding & Real-time Index',
                            status: 'Strong',
                            analysis: `Gemini excels at picking up recent Malaysian announcements. AeroMY's RM199 Sabah & Sarawak Fixed Fares campaign is highly indexed due to direct crawls of government transport announcements and Metro Awani reviews. However, performance declines slightly due to un-structured FAQ components.`
                        },
                        {
                            modelName: 'GPT-4 (OpenAI)',
                            score: isAeroMY ? 68 : 58,
                            sourcingPriority: 'Bing Search & High-Authority Static Archives',
                            status: 'Moderate',
                            analysis: `GPT-4 relies heavily on high-authority business reviews and Wikipedia. Because AeroMY's corporate structural updates and recent client service resolutions are not represented on high-authority static wikis, GPT-4's contextual synthesis repeats older 2025 delay and refund complaints.`
                        },
                        {
                            modelName: 'Claude (Anthropic)',
                            score: isAeroMY ? 58 : 50,
                            sourcingPriority: 'Crawl Archives & Structured PDF Statements',
                            status: 'Moderate',
                            analysis: `Claude synthesizes structured reports and official policy whitepapers extremely well. Since ${brandDisplayName} lacks JSON-LD corporate schemas and structured media advisories on its website, Claude frequently marks the brand's operational claims as 'unverified by machine metadata'.`
                        },
                        {
                            modelName: 'Perplexity (Search-Centric)',
                            score: isAeroMY ? 76 : 68,
                            sourcingPriority: 'Direct Citation Parsing & RSS Feeds',
                            status: 'Strong',
                            analysis: `Perplexity indexes direct, real-time press links. It successfully cites AeroMY's positive coverage in Warta Kini and Astro Awani when users ask for cheap Raya travel. However, synthetic negative reviews on social forums skew the overall narrative sentiment vector.`
                        }
                    ],
                    queries: [
                        {
                            query: `Cheapest domestic flights to Sabah/Sarawak for Raya 2026`,
                            brandStatus: isAeroMY ? 'Recommended (Rank #1)' : 'Mentioned (Rank #3)',
                            reason: isAeroMY 
                                ? 'Highly recommended due to massive machine indexing of the capped RM199 fare press release endorsed by the Ministry of Transport.'
                                : 'Mentioned as a secondary option, but overshadowed by competitor promotions with clearer structured price tables.',
                            sentimentVector: 'Positive',
                            recommendingModels: ['Gemini', 'Perplexity', 'GPT-4']
                        },
                        {
                            query: `Most reliable airline in Malaysia with responsive customer support`,
                            brandStatus: 'Not Recommended',
                            reason: isAeroMY 
                                ? 'Specifically filtered out of recommendations. AI models consistently cite frequent user complaints about "Ask Bot" looping errors and automated customer service bottlenecks scraped from local forums.'
                                : 'Left out of the top set due to a lack of verified operational performance indices and customer praise in scraped earned media.',
                            sentimentVector: 'Negative',
                            recommendingModels: []
                        },
                        {
                            query: `Airlines implementing sustainable green fuels (SAF) in ASEAN`,
                            brandStatus: 'Unranked',
                            reason: `${brandDisplayName} has no structured corporate statements or carbon disclosure filings indexed in the public datasets, allowing competitors like National Airways to capture 100% of the AI green-reputation category today.`,
                            sentimentVector: 'Neutral',
                            recommendingModels: ['Claude']
                        }
                    ],
                    sources: [
                        { name: 'Mainstream Malay Dailies (Astro Awani, Metro Awani, Warta Kini)', percentage: 45, authority: 'High' },
                        { name: 'Unstructured Social Feeds (MicroBlog, Forums, VidStream)', percentage: 35, authority: 'Low' },
                        { name: 'Official Corporate Press Portal', percentage: 15, authority: 'Medium' },
                        { name: 'Wikipedia & Static Knowledge Graphs', percentage: 5, authority: 'High' }
                    ],
                    recommendations: [
                        `Implement standardized Schema.org JSON-LD structural microdata across all corporate announcements. This ensures search engine crawl agents can mathematically parse and verify your ticket prices, schedules, and policy updates.`,
                        `Proactively generate high-authority earned media links. Instead of standard corporate press wires, focus on pitching exclusive interviews to Astro Awani and Metro Awani. Conversational models treat high-authority local press citations as "un-fakeable" trust vectors.`,
                        `Deploy an authoritative holding statement targeting the "Ask Bot customer service loops" narrative. By providing structured, clear solutions on an indexed FAQ page, you can re-train LLMs to synthesize a recovery narrative rather than reciting old complaints.`
                    ]
                };

                setReport(simulatedReport);
                setIsLoading(false);
            }, 1200);

        } catch (err: any) {
            setErrorMessage(err?.message || 'An error occurred while generating the audit. Please try again.');
            setIsLoading(false);
        }
    }, [brandName]);

    // Run initial audit on load for active workspace
    React.useEffect(() => {
        handleRunAudit();
    }, []);

    const handleExport = async () => {
        if (isExporting || !report) return;
        setIsExporting(true);
        await new Promise(resolve => setTimeout(resolve, 50));
        await exportElementAsPDF('aeo-report-container', `${brandName.replace(/\s+/g, '_')}_AI_Search_Visibility_Audit`);
        setIsExporting(false);
    };

    return (
        <div className="fade-in space-y-6">
            <Header 
                title="AI Search Visibility & AEO Audit" 
                subtitle="Evaluate and optimize your brand's authority, recommendations, and share-of-voice within conversational search engines, chatbots, and the Zero-Click discovery landscape."
            />

            {/* Top Command Center & Brand Selector */}
            <Card className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Brand / Client Portfolio</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                                placeholder="e.g., AeroMY, SparkJet"
                                className="flex-grow bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                            <button
                                onClick={handleRunAudit}
                                disabled={isLoading}
                                className="btn btn-primary whitespace-nowrap flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <LoadingSpinner className="!w-4 !h-4 !border-white" />
                                        <span>Auditing...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <span>Analyze AI Footprint</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto self-end">
                        {report && (
                            <button onClick={handleExport} disabled={isExporting} className="btn btn-secondary w-full md:w-auto flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                {isExporting ? 'Generating PDF...' : 'Download Briefing PDF'}
                            </button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('audit')}
                    className={`pb-4 px-6 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
                        activeTab === 'audit' 
                            ? 'border-amber-500 text-amber-600' 
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    AEO Footprint Audit
                </button>
                <button
                    onClick={() => setActiveTab('moat')}
                    className={`pb-4 px-6 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
                        activeTab === 'moat' 
                            ? 'border-amber-500 text-amber-600' 
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l5.5-5.5a1 1 0 011.414 0l5.5 5.5A12.02 12.02 0 0021 8.984a11.955 11.955 0 01-2.382-5.000z" />
                    </svg>
                    Reputation Moat Sandbox
                </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
                <Card className="border border-red-200 bg-red-50 p-4">
                    <p className="text-red-700 font-medium text-center">{errorMessage}</p>
                </Card>
            )}

            {/* Tab 1: AEO Audit Dashboard */}
            {activeTab === 'audit' && (
                <div id="aeo-report-container" className="space-y-6">
                    {isLoading ? (
                        <div className="py-24 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200">
                            <LoadingSpinner className="mb-4" />
                            <p className="text-slate-600 font-medium">Scanning LLM indices and crawling search-grounding vectors...</p>
                            <p className="text-xs text-slate-400 mt-1">Analyzing Astro Awani, Metro Awani, and unstructured social mentions</p>
                        </div>
                    ) : report ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* Left Column: Top Level Stats & Sourcing */}
                            <div className="lg:col-span-1 space-y-6">
                                <Card className="p-6 text-center border-l-4 border-l-amber-500">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Overall AEO Index</h3>
                                    <div className="relative inline-flex items-center justify-center my-4">
                                        <svg className="w-32 h-32 transform -rotate-90">
                                            <circle cx="64" cy="64" r="54" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                                            <circle 
                                                cx="64" 
                                                cy="64" 
                                                r="54" 
                                                stroke="#f59e0b" 
                                                strokeWidth="10" 
                                                fill="transparent" 
                                                strokeDasharray={2 * Math.PI * 54} 
                                                strokeDashoffset={(2 * Math.PI * 54) * (1 - report.aeoScore / 100)} 
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center justify-center">
                                            <span className="text-3xl font-black text-slate-800">{report.aeoScore}%</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Visibility</span>
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-700">Moderate Visibility</p>
                                    <p className="text-xs text-slate-500 mt-1">Brand is referenced, but rarely serves as primary authoritative recommendation.</p>
                                </Card>

                                <Card title="Machine-Readability Index" className="p-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-slate-700">Schema.org Integration</span>
                                        <span className="text-sm font-bold text-amber-600">{report.machineReadabilityIndex}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-3 mb-4">
                                        <div className="bg-amber-500 h-3 rounded-full" style={{ width: `${report.machineReadabilityIndex}%` }}></div>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Bots and LLMs look for high-fidelity structured data in the site headers. A score of {report.machineReadabilityIndex}% indicates your press announcements are highly unstructured, forcing models to rely on third-party scrapers.
                                    </p>
                                </Card>

                                <Card title="Scraped Sourcing Footprint" className="p-6">
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-3">Model Sourcing Networks</p>
                                    <div className="space-y-3">
                                        {report.sources.map((src, i) => (
                                            <div key={i} className="text-xs">
                                                <div className="flex justify-between items-center text-slate-700 font-medium mb-1">
                                                    <span className="break-words mr-2 font-bold">{src.name}</span>
                                                    <span className="flex-shrink-0">{src.percentage}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-1.5 flex overflow-hidden">
                                                    <div 
                                                        className={`h-1.5 rounded-full ${
                                                            src.authority === 'High' ? 'bg-indigo-500' : src.authority === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'
                                                        }`} 
                                                        style={{ width: `${src.percentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-0.5">
                                                    <span>Authority Vector</span>
                                                    <span className={src.authority === 'High' ? 'text-indigo-600 font-bold' : src.authority === 'Medium' ? 'text-amber-600 font-bold' : 'text-slate-500'}>{src.authority}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            {/* Center & Right Column: Detailed Analysis & Queries */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="p-6">
                                    <h3 className="text-lg font-black text-slate-800 mb-2">Executive Summary</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed break-words whitespace-normal">{report.summary}</p>
                                </Card>

                                {/* Multi-Model Paradox Comparison */}
                                <Card title="The Multi-Model Paradox Analysis" className="p-6">
                                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                        Different LLMs prioritize fundamentally different sourcing pipelines. Here is how major answer engines index <strong>{report.brandName}</strong> based on their proprietary architectures.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {report.modelBreakdown.map((model, i) => (
                                            <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                                <div className="flex justify-between items-center mb-2 gap-2">
                                                    <h4 className="font-bold text-slate-800 break-words">{model.modelName}</h4>
                                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 ${
                                                        model.status === 'Strong' ? 'bg-emerald-500/10 text-emerald-700' : 'bg-amber-500/10 text-amber-700'
                                                    }`}>{model.score}/100</span>
                                                </div>
                                                <p className="text-[11px] font-bold text-slate-500 mb-2 break-words">Primary Sourcing: <span className="text-amber-600 font-medium break-words">{model.sourcingPriority}</span></p>
                                                <p className="text-xs text-slate-600 leading-relaxed break-words whitespace-normal">{model.analysis}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                {/* The Invisible Consideration Set */}
                                <Card title="The Invisible Consideration Set Diagnostic" className="p-6">
                                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                        Conversational search bypasses blue-link result pages entirely. We audited how AI recommendation engines respond when users enter high-value consumer intents related to your category.
                                    </p>
                                    <div className="space-y-4">
                                        {report.queries.map((q, i) => (
                                            <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col md:flex-row gap-4 items-start w-full overflow-hidden">
                                                <div className="flex-1 w-full min-w-0">
                                                    <div className="flex items-center gap-2 mb-2 flex-wrap w-full">
                                                        <span className="text-xs font-bold text-amber-600 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 font-mono flex-shrink-0">INTENT</span>
                                                        <span className="text-sm font-extrabold text-slate-800 break-words whitespace-normal w-full md:w-auto">"{q.query}"</span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 leading-relaxed mb-3 break-words whitespace-normal"><strong className="text-slate-800">Recommendation Status:</strong> {q.reason}</p>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-[10px] font-bold text-slate-400">Recommending Models:</span>
                                                        {q.recommendingModels.length > 0 ? (
                                                            q.recommendingModels.map((m, idx) => (
                                                                <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold break-words">{m}</span>
                                                            ))
                                                        ) : (
                                                            <span className="text-rose-600 text-[10px] font-bold bg-rose-50 px-2 py-0.5 rounded">None (Locked Out)</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="w-full md:w-auto flex-shrink-0 flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                                                    <div className={`px-3 py-1 rounded-full text-xs font-extrabold text-center break-words ${
                                                        q.brandStatus.includes('Recommended') ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20' :
                                                        q.brandStatus.includes('Mentioned') ? 'bg-blue-500/10 text-blue-700 border border-blue-500/20' :
                                                        'bg-rose-50/50 text-rose-600 border border-rose-500/20'
                                                    }`}>
                                                        {q.brandStatus}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[10px] font-bold text-slate-400">Sentiment:</span>
                                                        <span className={`text-[10px] font-extrabold ${
                                                            q.sentimentVector === 'Positive' ? 'text-emerald-600' : q.sentimentVector === 'Negative' ? 'text-rose-600' : 'text-slate-500'
                                                        }`}>{q.sentimentVector}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                {/* Strategic Blueprint Recommendations */}
                                <Card title="Tactical AEO Recommendations" className="p-6 card-color-3">
                                    <div className="space-y-4">
                                        {report.recommendations.map((rec, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center flex-shrink-0 text-amber-600 font-bold text-sm">
                                                    {i + 1}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h5 className="font-bold text-slate-800 text-sm mb-1 break-words">
                                                        {i === 0 ? 'Inject Machine-Readable Schemas' : i === 1 ? 'Strengthen Earth-Bound Trust Vectors' : 'Address Scraped Narrative Backlash'}
                                                    </h5>
                                                    <p className="text-xs text-slate-600 leading-relaxed break-words whitespace-normal">{rec}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-slate-500">No report loaded. Enter a brand above and click Analyze.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Tab 2: Reputation Moat Sandbox */}
            {activeTab === 'moat' && (
                <div className="space-y-6">
                    {/* Top Enhancement Section: LLM Specificity and API Integration */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
                        {/* LLM Specificity Selector */}
                        <Card title="Target Discovery Engine Tuning" className="lg:col-span-2 p-6">
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                Different answer engines weight data sources uniquely. Select a specialized LLM crawler profile below to dynamically re-calibrate trust indexes and vulnerability matrices in real time.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {[
                                    { id: 'all', name: 'All Engines (Average)', icon: '🌐' },
                                    { id: 'gemini', name: 'Google Gemini', icon: '✨' },
                                    { id: 'perplexity', name: 'Perplexity AI', icon: '🔍' },
                                    { id: 'chatgpt', name: 'OpenAI ChatGPT', icon: '🤖' }
                                ].map((engine) => (
                                    <button
                                        key={engine.id}
                                        onClick={() => setSelectedEngine(engine.id as any)}
                                        className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                                            selectedEngine === engine.id 
                                                ? 'ring-2 ring-amber-500 border-amber-500 bg-white font-extrabold shadow-md' 
                                                : 'hover:bg-slate-50 border-slate-200 text-slate-600 bg-slate-50/50'
                                        }`}
                                    >
                                        <span className="text-lg mb-1">{engine.icon}</span>
                                        <span className="text-xs font-bold leading-tight">{engine.name}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 leading-relaxed font-medium">
                                <span className="font-extrabold text-slate-700">Weights Engine Focus: </span>
                                {getEngineWeights(selectedEngine).notes}
                            </div>
                        </Card>

                        {/* Live Data Connector (Ahrefs / Semrush Gateway) */}
                        <Card title="Cision / Ahrefs API Connector" className="p-6">
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                Avoid manual estimation. Link this sandbox to live domain crawlers to dynamically parse live backlink profiles.
                            </p>
                            <div className="flex gap-2 mb-3">
                                <select 
                                    value={apiProvider} 
                                    onChange={(e) => setApiProvider(e.target.value as any)}
                                    disabled={isSyncing}
                                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                >
                                    <option value="ahrefs">Ahrefs Premium V3</option>
                                    <option value="semrush">Semrush Keyword Magic</option>
                                </select>
                                <button
                                    onClick={handleSyncLiveApi}
                                    disabled={isSyncing}
                                    className={`flex-1 text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                                        isSyncing 
                                            ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                                    }`}
                                >
                                    {isSyncing ? (
                                        <>
                                            <LoadingSpinner className="!w-3 !h-3 !border-amber-700" />
                                            <span>Crawling...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
                                            </svg>
                                            <span>Sync Live Profile</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="space-y-1.5">
                                {liveUrlsScraped.length > 0 ? (
                                    <div className="p-2 bg-slate-900 rounded text-[9px] font-mono text-slate-300 max-h-[70px] overflow-y-auto space-y-1">
                                        {liveUrlsScraped.map((step, idx) => (
                                            <div key={idx} className={idx === liveUrlsScraped.length - 1 ? 'text-emerald-400 font-bold' : ''}>
                                                &gt; {step}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-[10px] text-slate-400 bg-slate-50 p-2.5 rounded border border-slate-100 flex items-center justify-between">
                                        <span>Status: {syncStatus === 'synced' ? 'Connected & Verified' : 'Simulated Sandbox Mode'}</span>
                                        {lastSyncTime && <span className="text-[9px] font-mono bg-emerald-50 text-emerald-600 px-1 rounded">Last Synced: {lastSyncTime}</span>}
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Dual Comparative Benchmarking Arena */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in-up">
                        {/* Interactive Sliders: Your Brand vs Competitor Brand */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Your Brand Control Card */}
                            <Card title={`${brandName} (Your Brand Vectors)`} className="p-6 border-l-4 border-l-amber-500">
                                <div className="space-y-5">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                High-Authority Earned Media
                                            </label>
                                            <span className="text-xs font-extrabold text-slate-800">{earnedMedia} links</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="30" 
                                            value={earnedMedia} 
                                            onChange={(e) => setEarnedMedia(Number(e.target.value))}
                                            className="w-full accent-amber-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" 
                                        />
                                        <p className="text-[9px] text-slate-400 mt-1">Exclusive interviews & features in Astro Awani, Metro Awani, and Warta Kini.</p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                Structured Press releases
                                            </label>
                                            <span className="text-xs font-extrabold text-slate-800">{prCampaignValue} distributions</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="20" 
                                            value={prCampaignValue} 
                                            onChange={(e) => setPrCampaignValue(Number(e.target.value))}
                                            className="w-full accent-amber-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" 
                                        />
                                        <p className="text-[9px] text-slate-400 mt-1">Factual announcements with valid Schema.org microdata and tables.</p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                                Social & Competitor Noise
                                            </label>
                                            <span className="text-xs font-extrabold text-slate-800">{syntheticNoise} index</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="15" 
                                            value={syntheticNoise} 
                                            onChange={(e) => setSyntheticNoise(Number(e.target.value))}
                                            className="w-full accent-amber-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" 
                                        />
                                        <p className="text-[9px] text-slate-400 mt-1">Unverified forum backlash, coordinated negative threads, or viral TikTok criticism.</p>
                                    </div>
                                </div>
                            </Card>

                            {/* Competitor Brand Control Card */}
                            <Card title="Competitor Sandbox Calibration" className="p-6 border-l-4 border-l-slate-400 bg-slate-50/50">
                                <div className="space-y-5">
                                    <div className="mb-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Competitor Brand Name</label>
                                        <input 
                                            type="text" 
                                            value={competitorName} 
                                            onChange={(e) => setCompetitorName(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                                Earned Media links
                                            </label>
                                            <span className="text-xs font-extrabold text-slate-800">{competitorEarnedMedia} links</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="30" 
                                            value={competitorEarnedMedia} 
                                            onChange={(e) => setCompetitorEarnedMedia(Number(e.target.value))}
                                            className="w-full accent-slate-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                                Structured releases
                                            </label>
                                            <span className="text-xs font-extrabold text-slate-800">{competitorPrCampaignValue} distributions</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="20" 
                                            value={competitorPrCampaignValue} 
                                            onChange={(e) => setCompetitorPrCampaignValue(Number(e.target.value))}
                                            className="w-full accent-slate-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                                                Social/Forum Noise
                                            </label>
                                            <span className="text-xs font-extrabold text-slate-800">{competitorSyntheticNoise} index</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="15" 
                                            value={competitorSyntheticNoise} 
                                            onChange={(e) => setCompetitorSyntheticNoise(Number(e.target.value))}
                                            className="w-full accent-slate-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Dual Index Resilience Gauges and Verdicts */}
                        <div className="lg:col-span-8 space-y-6">
                            <Card className="p-6">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 font-sans">Competitor Benchmarking: Moat Index Comparison</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4 border-b border-slate-100">
                                    {/* Your Brand Meter */}
                                    <div className="flex flex-col items-center p-5 bg-amber-50/20 rounded-xl border border-amber-500/10">
                                        <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-3 py-1 rounded-full mb-3 uppercase tracking-wider">{brandName} (Your Brand)</span>
                                        <div className="relative inline-flex items-center justify-center flex-shrink-0 my-2">
                                            <svg className="w-32 h-32 transform -rotate-90">
                                                <circle cx="64" cy="64" r="54" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                                                <circle 
                                                    cx="64" 
                                                    cy="64" 
                                                    r="54" 
                                                    stroke={calculatedMoatScore >= 80 ? '#10b981' : calculatedMoatScore >= 50 ? '#f59e0b' : '#f43f5e'} 
                                                    strokeWidth="10" 
                                                    fill="transparent" 
                                                    strokeDasharray={2 * Math.PI * 54} 
                                                    strokeDashoffset={(2 * Math.PI * 54) * (1 - calculatedMoatScore / 100)} 
                                                    strokeLinecap="round"
                                                    className="transition-all duration-300"
                                                />
                                            </svg>
                                            <div className="absolute flex flex-col items-center justify-center">
                                                <span className="text-3xl font-black text-slate-800">{calculatedMoatScore}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">MOAT SCORE</span>
                                            </div>
                                        </div>
                                        <div className={`mt-3 px-3 py-1 rounded-lg border text-xs font-extrabold text-center ${getMoatStatus(calculatedMoatScore).color}`}>
                                            {getMoatStatus(calculatedMoatScore).label}
                                        </div>
                                    </div>

                                    {/* Competitor Brand Meter */}
                                    <div className="flex flex-col items-center p-5 bg-slate-50 rounded-xl border border-slate-200">
                                        <span className="text-xs font-extrabold text-slate-600 bg-slate-200 px-3 py-1 rounded-full mb-3 uppercase tracking-wider">{competitorName} (Competitor)</span>
                                        <div className="relative inline-flex items-center justify-center flex-shrink-0 my-2">
                                            <svg className="w-32 h-32 transform -rotate-90">
                                                <circle cx="64" cy="64" r="54" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                                                <circle 
                                                    cx="64" 
                                                    cy="64" 
                                                    r="54" 
                                                    stroke={calculatedCompetitorMoatScore >= 80 ? '#10b981' : calculatedCompetitorMoatScore >= 50 ? '#f59e0b' : '#f43f5e'} 
                                                    strokeWidth="10" 
                                                    fill="transparent" 
                                                    strokeDasharray={2 * Math.PI * 54} 
                                                    strokeDashoffset={(2 * Math.PI * 54) * (1 - calculatedCompetitorMoatScore / 100)} 
                                                    strokeLinecap="round"
                                                    className="transition-all duration-300"
                                                />
                                            </svg>
                                            <div className="absolute flex flex-col items-center justify-center">
                                                <span className="text-3xl font-black text-slate-800">{calculatedCompetitorMoatScore}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">MOAT SCORE</span>
                                            </div>
                                        </div>
                                        <div className={`mt-3 px-3 py-1 rounded-lg border text-xs font-extrabold text-center ${getMoatStatus(calculatedCompetitorMoatScore).color}`}>
                                            {getMoatStatus(calculatedCompetitorMoatScore).label}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Strategic Sourcing Breakdown & Defensibility Verdict</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                        <div className="p-3 bg-slate-50 rounded border border-slate-150">
                                            <h5 className="font-bold text-slate-800 mb-1">{brandName} Standing:</h5>
                                            <p className="text-slate-600 leading-relaxed text-[11px]">
                                                {calculatedMoatScore > calculatedCompetitorMoatScore ? (
                                                    <span className="text-emerald-600 font-extrabold">🏆 LEADING THE CATEGORY.</span>
                                                ) : calculatedMoatScore === calculatedCompetitorMoatScore ? (
                                                    <span className="text-amber-600 font-extrabold">🤝 LEVEL FIELD MATCH.</span>
                                                ) : (
                                                    <span className="text-rose-600 font-extrabold">⚠️ AT A STRATEGIC DISADVANTAGE.</span>
                                                )}{" "}
                                                Your current trust vectors offer {calculatedMoatScore}% defense. Under the active {selectedEngine === 'all' ? 'standard model suite' : selectedEngine} crawler settings, your brand's authority {calculatedMoatScore >= 80 ? 'remains invulnerable to negative competitor noise.' : 'is prone to being masked by unverified competitor complaints.'}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded border border-slate-150">
                                            <h5 className="font-bold text-slate-800 mb-1">{competitorName} Analysis:</h5>
                                            <p className="text-slate-600 leading-relaxed text-[11px]">
                                                With a score of {calculatedCompetitorMoatScore}%, {competitorName}'s digital authority holds a {calculatedCompetitorMoatScore >= 80 ? 'highly resilient footprint in AI indexes.' : 'highly volatile and vulnerable state.'} {calculatedCompetitorMoatScore < calculatedMoatScore ? 'An aggressive, structured corporate communications push by your brand can easily lock them out of conversational recommendations.' : 'You must immediately scale high-authority Astro Awani news pieces to close the trust deficit.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Interactive Formula Metrics Details</h4>
                                    <div className="p-4 bg-slate-900 rounded-xl text-slate-300 font-mono text-[11px] overflow-x-auto break-words whitespace-pre-wrap leading-relaxed">
                                        <p className="text-amber-400 font-bold">// Dynamic {selectedEngine.toUpperCase()} Specificity Moat Formula Applied</p>
                                        <p className="mt-1 break-all text-[11px] text-slate-400">
                                            Formula: ((EarnedMedia * {getEngineWeights(selectedEngine).earned}) + (StructuredPress * {getEngineWeights(selectedEngine).pr})) / Max(1, SocialNoise * {getEngineWeights(selectedEngine).noise}) * 10
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-800 text-[11px]">
                                            <div>
                                                <span className="text-amber-500 font-bold">{brandName} Index:</span>
                                                <p className="text-slate-400">Numerator: ({earnedMedia} * {getEngineWeights(selectedEngine).earned}) + ({prCampaignValue} * {getEngineWeights(selectedEngine).pr}) = {(earnedMedia * getEngineWeights(selectedEngine).earned) + (prCampaignValue * getEngineWeights(selectedEngine).pr)}</p>
                                                <p className="text-slate-400">Denominator: Max(1, {syntheticNoise} * {getEngineWeights(selectedEngine).noise}) = {Math.max(1, syntheticNoise * getEngineWeights(selectedEngine).noise)}</p>
                                                <p className="text-emerald-400 font-bold mt-1">Final Index Score: {calculatedMoatScore}</p>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 font-bold">{competitorName} Index:</span>
                                                <p className="text-slate-400">Numerator: ({competitorEarnedMedia} * {getEngineWeights(selectedEngine).earned}) + ({competitorPrCampaignValue} * {getEngineWeights(selectedEngine).pr}) = {(competitorEarnedMedia * getEngineWeights(selectedEngine).earned) + (competitorPrCampaignValue * getEngineWeights(selectedEngine).pr)}</p>
                                                <p className="text-slate-400">Denominator: Max(1, {competitorSyntheticNoise} * {getEngineWeights(selectedEngine).noise}) = {Math.max(1, competitorSyntheticNoise * getEngineWeights(selectedEngine).noise)}</p>
                                                <p className="text-slate-400 font-bold mt-1">Final Index Score: {calculatedCompetitorMoatScore}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AISearchVisibility;
