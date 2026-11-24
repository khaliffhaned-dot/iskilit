import * as React from 'react';
import { Sparkles, Cpu, ToggleLeft, ToggleRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { isLiveAiAvailable } from '../services/aiService.ts';

const ModelIndicator: React.FC = () => {
    const [hasApiKey, setHasApiKey] = React.useState<boolean>(false);
    const [engineMode, setEngineMode] = React.useState<'live' | 'simulated'>('simulated');
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [showTooltip, setShowTooltip] = React.useState<boolean>(false);

    const checkStatus = async () => {
        setIsLoading(true);
        try {
            const available = await isLiveAiAvailable();
            setHasApiKey(available);
            
            const savedMode = localStorage.getItem('escalate-engine-mode') as 'live' | 'simulated' | null;
            if (savedMode) {
                setEngineMode(savedMode === 'live' && available ? 'live' : 'simulated');
            } else {
                setEngineMode(available ? 'live' : 'simulated');
            }
        } catch (e) {
            console.error("Failed to check status:", e);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        checkStatus();
        // Listen for workspace or settings updates
        window.addEventListener('storage', checkStatus);
        return () => window.removeEventListener('storage', checkStatus);
    }, []);

    const toggleMode = () => {
        if (!hasApiKey) return;
        const newMode = engineMode === 'live' ? 'simulated' : 'live';
        localStorage.setItem('escalate-engine-mode', newMode);
        setEngineMode(newMode);
        // Trigger page re-load or dispatch event to refresh state across components
        window.dispatchEvent(new Event('escalate-engine-mode-changed'));
    };

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-500 font-medium">
                <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
                <span>Checking AI Engine...</span>
            </div>
        );
    }

    return (
        <div className="relative inline-block" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
            <div className="flex items-center gap-2">
                {engineMode === 'live' ? (
                    <button 
                        onClick={toggleMode}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full text-xs font-bold shadow-sm transition-all duration-300 transform hover:scale-[1.02]"
                    >
                        <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-amber-100" />
                        <span>Live Enterprise AI</span>
                        {hasApiKey && <ToggleRight className="w-4 h-4 ml-0.5 text-white" />}
                    </button>
                ) : (
                    <button 
                        onClick={toggleMode}
                        disabled={!hasApiKey}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${
                            hasApiKey 
                                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer' 
                                : 'bg-slate-100/80 text-slate-500 border border-slate-200/50 cursor-help'
                        }`}
                    >
                        <Cpu className={`w-3.5 h-3.5 ${hasApiKey ? 'text-amber-500' : 'text-slate-400'}`} />
                        <span>Simulated AI Engine</span>
                        {hasApiKey && <ToggleLeft className="w-4 h-4 ml-0.5 text-slate-400" />}
                    </button>
                )}
            </div>

            {showTooltip && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 text-xs text-slate-600 animate-in fade-in slide-in-from-top-1 duration-200">
                    <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-amber-500" />
                        AI Narrative System Status
                    </h4>
                    
                    <div className="space-y-2">
                        <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            {hasApiKey ? (
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            )}
                            <div>
                                <p className="font-semibold text-slate-700">
                                    {hasApiKey ? "Gemini API Keys Connected" : "Running on Sandbox Simulation"}
                                </p>
                                <p className="text-slate-500 leading-relaxed mt-0.5">
                                    {hasApiKey 
                                        ? "Your workspace is securely proxying live analysis and generation through Gemini 3.5 Flash server-side." 
                                        : "Using ultra-high fidelity Malaysian mock databases. Configure your GEMINI_API_KEY inside the dashboard settings to unlock live intelligence."}
                                </p>
                            </div>
                        </div>

                        {hasApiKey && (
                            <p className="text-slate-400 leading-relaxed italic">
                                * Click the badge to toggle instantly between the Live Enterprise model and the zero-latency Sandbox Simulation.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModelIndicator;
