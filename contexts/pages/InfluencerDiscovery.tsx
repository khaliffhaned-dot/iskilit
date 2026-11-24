import * as React from 'react';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import { findInfluencers, draftPersonalizedPitch } from '../../services/aiService.ts';
import { Influencer, ActivePage, Workspace, User, MediaContact } from '../../types.ts';
import * as cloudService from '../../services/cloudService.ts';
import { notifications } from '../../services/notificationsService.ts';

const industries = ['Technology', 'Finance', 'PR & Communications', 'Automotive', 'Healthcare', 'Retail'];
const types = ['Any', 'Social Media Creator', 'Journalist', 'Industry Analyst', 'Media Personality'];

interface InfluencerDiscoveryProps {
  setActivePage: (pageState: ActivePage) => void;
  activeWorkspace: Workspace;
  currentUser: User;
}

const InfluencerDiscovery: React.FC<InfluencerDiscoveryProps> = ({ setActivePage, activeWorkspace, currentUser }) => {
    const [industry, setIndustry] = React.useState(industries[0]);
    const [type, setType] = React.useState(types[0]);
    const [influencers, setInfluencers] = React.useState<Influencer[]>([]);
    const [mediaList, setMediaList] = React.useState<Influencer[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isPitching, setIsPitching] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [pitchModalOpen, setPitchModalOpen] = React.useState(false);
    const [announcement, setAnnouncement] = React.useState('');
    const [generatedPitches, setGeneratedPitches] = React.useState<{ name: string, pitch: string }[]>([]);

    const handleSearch = React.useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setInfluencers([]);
        try {
            const results = await findInfluencers(activeWorkspace.id, { industry, type }, currentUser.persona, currentUser.persona.aiEngine);
            setInfluencers(results || []);
        } catch (err) {
            setError('Failed to discover influencers.');
        } finally {
            setIsLoading(false);
        }
    }, [activeWorkspace.id, industry, type, currentUser]);

    const handleToggleMediaList = (influencer: Influencer) => {
        setMediaList(prev =>
            prev.some(i => i.name === influencer.name)
                ? prev.filter(i => i.name !== influencer.name)
                : [...prev, influencer]
        );
    };
    
    const handleAddToHub = async (e: React.MouseEvent, influencer: Influencer) => {
        e.stopPropagation();
        const existingContacts = await cloudService.getMediaContacts(activeWorkspace.id);
        if (existingContacts.some(c => c.name === influencer.name && c.platform === influencer.platform)) {
             notifications.add({ title: 'Contact Exists', message: `${influencer.name} is already in your Media Hub.` });
             return;
        }

        const newContact: MediaContact = {
            ...influencer,
            id: `mc_${Date.now()}_${Math.random()}`,
            relationshipScore: 50, // Starting score
            status: 'To Pitch',
            lastContacted: new Date().toISOString(),
            interactionHistory: []
        };
        await cloudService.addMediaContact(activeWorkspace.id, newContact);
        notifications.add({ title: 'Contact Added', message: `${influencer.name} has been added to the Strategic Media Relations Hub.`, page: 'Strategic Media Relations' });
    };

    const handleGeneratePitches = async () => {
        if (!announcement.trim()) return;
        setIsPitching(true);
        setGeneratedPitches([]);
        const pitches: { name: string, pitch: string }[] = [];
        for (const journalist of mediaList) {
            const pitchText = await draftPersonalizedPitch(activeWorkspace.id, journalist, announcement, currentUser.persona, currentUser.persona.aiEngine);
            pitches.push({ name: journalist.name, pitch: pitchText });
            setGeneratedPitches([...pitches]); // Update state incrementally
        }
        setIsPitching(false);
    };
    
    const inputClass = "w-full p-2 border rounded-md bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-amber-500 focus:border-amber-500";


    return (
        <div className="fade-in">
            <Header title="KOL & Media Cartography" subtitle="Map the landscape. Identify and qualify the key opinion leaders, journalists, and analysts who shape your market's narrative." />
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <select value={industry} onChange={e => setIndustry(e.target.value)} className={inputClass}>
                        {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                    <select value={type} onChange={e => setType(e.target.value)} className={inputClass}>
                        {types.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <button onClick={handleSearch} disabled={isLoading} className="w-full btn btn-primary py-3">
                    {isLoading ? 'Discovering...' : 'Discover'}
                </button>
            </Card>

            <div className="mt-8">
                {isLoading && <div className="py-20"><LoadingSpinner /></div>}
                {influencers.length > 0 && (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-slate-800">Discovery Results</h2>
                            <button onClick={() => setPitchModalOpen(true)} disabled={mediaList.length === 0} className="btn btn-primary">
                                Craft Pitches ({mediaList.length})
                            </button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                            {influencers.map((influencer) => (
                                <Card key={influencer.id} className={`flex flex-col cursor-pointer transition-all duration-200 ${mediaList.some(i => i.id === influencer.id) ? 'border-amber-500 ring-2 ring-amber-500' : 'hover:border-amber-500'}`} onClick={() => handleToggleMediaList(influencer)}>
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold text-slate-800">{influencer.name}</h3>
                                        <p className="text-sm text-amber-600 font-semibold">{influencer.type} on {influencer.platform}</p>
                                        <p className="text-slate-600 text-sm mt-2">{influencer.bio}</p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
                                        <button onClick={(e) => handleAddToHub(e, influencer)} className="text-sm font-semibold text-amber-600 hover:text-amber-500 transition-colors">+ Add to Hub</button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {pitchModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setPitchModalOpen(false)}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200 text-slate-800" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="text-lg font-bold">AI Pitch Crafter</h3>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto">
                            <textarea value={announcement} onChange={e => setAnnouncement(e.target.value)} placeholder="Enter your core announcement or press release summary..." rows={4} className={inputClass} />
                            <button onClick={handleGeneratePitches} disabled={isPitching || !announcement} className="w-full btn btn-primary">
                                {isPitching ? 'Generating Pitches...' : 'Generate Personalized Pitches'}
                            </button>
                            {isPitching && <LoadingSpinner />}
                            <div className="space-y-4">
                                {generatedPitches.map(p => (
                                    <Card key={p.name} title={`Pitch for ${p.name}`} className="!bg-slate-50">
                                        <p className="text-sm whitespace-pre-wrap text-slate-600">{p.pitch}</p>
                                    </Card>
                                ))}
                            </div>
                        </div>
                         <div className="p-4 bg-slate-100 flex justify-end gap-2 rounded-b-lg">
                            <button onClick={() => setPitchModalOpen(false)} className="btn btn-secondary">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfluencerDiscovery;