import * as React from 'react';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import { User, UserPersona, BrandingSettings, AIEngine } from '../../types.ts';
import * as cloudService from '../../services/cloudService.ts';
import { notifications } from '../../services/notificationsService.ts';
import { isLiveAiAvailable } from '../../services/aiService.ts';

interface SettingsProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
}

type Tab = 'persona' | 'branding';

const Settings: React.FC<SettingsProps> = ({ currentUser, onUpdateUser }) => {
    const [activeTab, setActiveTab] = React.useState<Tab>('persona');
    const [persona, setPersona] = React.useState<UserPersona>(currentUser.persona || { style: '', priorities: '', aiEngine: 'Gemini 2.5 Flash' });
    const [branding, setBranding] = React.useState<BrandingSettings>(currentUser.branding || { logoUrl: null });
    const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved'>('idle');
    const [isUploading, setIsUploading] = React.useState(false);
    const [isLiveAvailable, setIsLiveAvailable] = React.useState(false);
    const [localEngineMode, setLocalEngineMode] = React.useState<'live' | 'simulated'>('simulated');

    React.useEffect(() => {
        const loadEngineStatus = async () => {
            const live = await isLiveAiAvailable();
            setIsLiveAvailable(live);
            const savedMode = localStorage.getItem('escalate-engine-mode') as 'live' | 'simulated' | null;
            if (savedMode) {
                setLocalEngineMode(savedMode === 'live' && live ? 'live' : 'simulated');
            } else {
                setLocalEngineMode(live ? 'live' : 'simulated');
            }
        };
        loadEngineStatus();
    }, []);

    const toggleLocalEngineMode = () => {
        const newMode = localEngineMode === 'live' ? 'simulated' : 'live';
        localStorage.setItem('escalate-engine-mode', newMode);
        setLocalEngineMode(newMode);
        window.dispatchEvent(new Event('escalate-engine-mode-changed'));
    };

    const handleSave = async () => {
        setSaveStatus('saving');
        const updatedUser = { ...currentUser, persona, branding };
        await onUpdateUser(updatedUser);
        await cloudService.updateUserProfile(updatedUser);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
    };
    
    const handlePersonaChange = (field: keyof UserPersona, value: string | AIEngine) => {
        setPersona(prev => ({ ...prev, [field]: value }));
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const logoUrl = await cloudService.uploadBrandingLogo(currentUser.uid, file);
            setBranding({ logoUrl });
            notifications.add({ title: 'Success', message: 'Agency logo has been updated.' });
        } catch (error) {
            console.error("Logo upload failed:", error);
            notifications.add({ title: 'Upload Failed', message: 'Could not upload the logo. Please try again.' });
        } finally {
            setIsUploading(false);
        }
    };


    const inputClass = "w-full p-2 border rounded-md bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-amber-500 focus:border-amber-500";
    const labelClass = "block text-sm font-medium text-slate-700 mb-1";
    
    return (
        <div className="fade-in">
            <Header title="Settings" subtitle="Customize your Escalate experience to better suit your agency's workflow and brand." />
            <div className="max-w-3xl mx-auto">
                <div className="mb-6 border-b border-slate-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('persona')}
                            className={`${activeTab === 'persona' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            AI Persona
                        </button>
                         <button
                            onClick={() => setActiveTab('branding')}
                            className={`${activeTab === 'branding' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Agency Branding
                        </button>
                    </nav>
                </div>
                <Card>
                    {activeTab === 'persona' && (
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">AI Communication Style</h3>
                            <p className="text-slate-500 mb-6 text-sm">Define how the AI should behave when generating content and analysis. This persona will be applied across all modules for this workspace.</p>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="style" className={labelClass}>Communication Style</label>
                                    <textarea id="style" value={persona.style} onChange={e => handlePersonaChange('style', e.target.value)} rows={3} className={inputClass} placeholder="e.g., Direct, data-driven, and concise." />
                                </div>
                                <div>
                                    <label htmlFor="priorities" className={labelClass}>Strategic Priorities</label>
                                    <textarea id="priorities" value={persona.priorities} onChange={e => handlePersonaChange('priorities', e.target.value)} rows={3} className={inputClass} placeholder="e.g., Market share, brand reputation, and competitive advantage." />
                                </div>
                                <div>
                                    <label htmlFor="aiEngine" className={labelClass}>Preferred AI Engine</label>
                                    <select id="aiEngine" value={persona.aiEngine} onChange={e => handlePersonaChange('aiEngine', e.target.value as AIEngine)} className={inputClass}>
                                        <option value="Gemini 2.5 Flash">Gemini 2.5 Flash (Fast &amp; Cost-Effective)</option>
                                        <option value="Gemini 2.5 Pro">Gemini 2.5 Pro (Highest Quality)</option>
                                    </select>
                                </div>
                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <label className="block text-sm font-semibold text-slate-800 mb-2">Enterprise Data Engine Mode</label>
                                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-700 text-sm flex items-center gap-1.5">
                                                {isLiveAvailable ? (
                                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block animate-pulse" />
                                                ) : (
                                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                                                )}
                                                {isLiveAvailable ? "Live Enterprise AI Connected" : "Sandbox Simulation Mode"}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                {isLiveAvailable 
                                                    ? "Real-time content analysis, competitive intelligence, and media insights are fully active using server-side Gemini 3.5 Flash." 
                                                    : "Using premium, offline-cached Malaysian narrative datasets. To switch to live-generation mode, set up GEMINI_API_KEY in your server environment."}
                                            </p>
                                        </div>
                                        {isLiveAvailable && (
                                            <button
                                                type="button"
                                                onClick={toggleLocalEngineMode}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                    localEngineMode === 'live' 
                                                        ? 'bg-amber-500 text-white shadow-sm hover:bg-amber-600' 
                                                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                                }`}
                                            >
                                                {localEngineMode === 'live' ? "Using Live AI" : "Using Simulated"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'branding' && (
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Agency & Client Branding</h3>
                            <p className="text-slate-500 mb-6 text-sm">Customize the look and feel of the platform and exported reports by uploading your agency logo.</p>
                             <div>
                                <label htmlFor="logoUrl" className={labelClass}>Agency Logo</label>
                                {branding.logoUrl && (
                                    <div className="my-2 p-2 border rounded-md inline-block bg-slate-50">
                                        <img src={branding.logoUrl} alt="Current logo" className="max-h-12" />
                                    </div>
                                )}
                                <input id="logoUrl" type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoUpload} disabled={isUploading} 
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200"
                                />
                                {isUploading && <p className="text-sm text-slate-500 mt-2">Uploading...</p>}
                            </div>
                        </div>
                    )}
                     <div className="flex justify-end items-center gap-4 pt-4 mt-6 border-t border-slate-200">
                        {saveStatus === 'saved' && <p className="text-green-600 text-sm font-semibold">Settings saved!</p>}
                        <button
                            onClick={handleSave}
                            disabled={saveStatus === 'saving'}
                            className="btn btn-primary"
                        >
                            {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Settings;