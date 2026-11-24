import * as React from 'react';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import * as cloudService from '../../services/cloudService.ts';
import { getEngagementRecommendations } from '../../services/aiService.ts';
import { User, Workspace, MediaContact, InteractionLog, InteractionType } from '../../types.ts';
import { notifications } from '../../services/notificationsService.ts';

interface StrategicMediaRelationsProps {
    activeWorkspace: Workspace;
    currentUser: User;
}

const RelationshipScore: React.FC<{ score: number }> = ({ score }) => {
    const getColor = () => {
        if (score > 75) return 'bg-green-500';
        if (score > 40) return 'bg-amber-500';
        return 'bg-red-500';
    };
    return (
        <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div className={`${getColor()} h-2.5 rounded-full`} style={{ width: `${score}%` }}></div>
        </div>
    );
};

interface EditContactModalProps {
    contact: MediaContact;
    onClose: () => void;
    onSave: (contact: MediaContact) => Promise<void>;
    onAddInteraction: (contactId: string, interaction: Omit<InteractionLog, 'id'>) => Promise<void>;
    brandName: string;
    currentUser: User;
    activeWorkspace: Workspace;
}

const EditContactModal: React.FC<EditContactModalProps> = ({ contact, onClose, onSave, onAddInteraction, brandName, currentUser, activeWorkspace }) => {
    const [editableContact, setEditableContact] = React.useState(contact);
    const [newInteraction, setNewInteraction] = React.useState({ type: 'Email' as InteractionType, notes: '' });
    const [recommendations, setRecommendations] = React.useState<string[]>([]);
    const [isLoadingRecs, setIsLoadingRecs] = React.useState(false);
    
    const fetchRecommendations = React.useCallback(async () => {
        setIsLoadingRecs(true);
        try {
            const result = await getEngagementRecommendations(activeWorkspace.id, { contact, brandName, userPersona: currentUser.persona }, currentUser.persona.aiEngine);
            setRecommendations(result?.recommendations || []);
        } catch(e) {
            console.error("Failed to get recommendations", e);
            setRecommendations(["AI service failed to generate recommendations."]);
        }
        setIsLoadingRecs(false);
    }, [contact, brandName, currentUser, activeWorkspace.id]);

    React.useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);


    const handleInteractionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newInteraction.notes.trim()) return;
        await onAddInteraction(contact.id, {
            ...newInteraction,
            date: new Date().toISOString()
        });
        setNewInteraction({ type: 'Email', notes: '' });
    }

    return (
         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 fade-in" onClick={onClose}>
            <div className="bg-white border border-slate-200 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200 flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">{editableContact.name}</h3>
                        <p className="text-sm text-amber-600 font-semibold">{editableContact.platform} - {editableContact.niche}</p>
                    </div>
                     <button onClick={onClose} className="text-slate-400 hover:text-slate-800 text-2xl leading-none">&times;</button>
                </div>
                
                <div className="p-6 flex-grow overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-50">
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-4">
                        <Card title="AI Engagement Advisor">
                             {isLoadingRecs ? <LoadingSpinner /> : (
                                <ul className="space-y-2">
                                    {(recommendations || []).map((rec, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.586l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                            <span>{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>
                        <Card title="Log Interaction">
                            <form onSubmit={handleInteractionSubmit} className="space-y-3">
                                <select value={newInteraction.type} onChange={e => setNewInteraction({...newInteraction, type: e.target.value as InteractionType})} className="w-full p-2 border rounded-md bg-white border-slate-300 text-slate-800">
                                    <option>Pitch</option>
                                    <option>Email</option>
                                    <option>Call</option>
                                    <option>Meeting</option>
                                    <option>Coverage</option>
                                </select>
                                <textarea value={newInteraction.notes} onChange={e => setNewInteraction({...newInteraction, notes: e.target.value})} placeholder="Notes..." rows={3} className="w-full p-2 border rounded-md bg-white border-slate-300 text-slate-800"></textarea>
                                <button type="submit" className="w-full py-2 bg-amber-500 text-slate-900 font-bold rounded-md hover:bg-amber-400">Add Log</button>
                            </form>
                        </Card>
                    </div>
                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card title="Interaction History">
                            <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                                {editableContact.interactionHistory && editableContact.interactionHistory.length > 0 ? (
                                    [...editableContact.interactionHistory].reverse().map(log => (
                                         <div key={log.id} className="p-3 bg-slate-100 border-l-4 border-slate-300 rounded-md">
                                            <p className="text-xs text-slate-500">{new Date(log.date).toLocaleString()}</p>
                                            <p className="font-semibold text-slate-700">{log.type}</p>
                                            <p className="text-sm text-slate-600 whitespace-pre-wrap">{log.notes}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500 text-center py-4">No interactions logged yet.</p>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end gap-3">
                    <button onClick={onClose} className="btn btn-secondary">Close</button>
                </div>
            </div>
        </div>
    );
};


const StrategicMediaRelations: React.FC<StrategicMediaRelationsProps> = ({ activeWorkspace, currentUser }) => {
    const [contacts, setContacts] = React.useState<MediaContact[]>([]);
    const [selectedContact, setSelectedContact] = React.useState<MediaContact | null>(null);

    const refreshContacts = React.useCallback(async () => {
      try {
        const updatedContacts = await cloudService.getMediaContacts(activeWorkspace.id);
        setContacts(updatedContacts);
        if (selectedContact) {
            const updatedSelected = updatedContacts.find(c => c.id === selectedContact.id);
            if (updatedSelected) {
                setSelectedContact(updatedSelected);
            } else {
                setSelectedContact(null); // The contact was deleted
            }
        }
      } catch (error) {
        console.error("Failed to refresh media contacts:", error);
      }
    }, [activeWorkspace.id, selectedContact]);

    React.useEffect(() => {
        refreshContacts();
    }, [activeWorkspace]);
    
    const handleSaveContact = async (updatedContact: MediaContact) => {
        await cloudService.updateMediaContact(activeWorkspace.id, updatedContact);
        await refreshContacts();
    };

    const handleAddInteraction = async (contactId: string, interaction: Omit<InteractionLog, 'id'>) => {
        await cloudService.logInteractionForContact(activeWorkspace.id, contactId, interaction);
        await refreshContacts();
        notifications.add({ title: 'Interaction Logged', message: `New interaction logged for ${selectedContact?.name}.` });
    };
    
    const handleDeleteContact = async (e: React.MouseEvent, contactId: string) => {
        e.stopPropagation();
        if(window.confirm("Are you sure you want to delete this contact? This action cannot be undone.")) {
            await cloudService.deleteMediaContact(activeWorkspace.id, contactId);
            await refreshContacts();
            notifications.add({ title: 'Contact Deleted', message: 'The media contact has been removed.' });
        }
    };

    return (
        <div className="fade-in">
            <Header title="Media Engagement Hub" subtitle="Your central CRM for media contacts. Track engagement, log interactions, and receive AI-powered outreach advice." />

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Outlet</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Relationship Score</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Contacted</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {contacts.map((contact) => (
                                <tr key={contact.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedContact(contact)}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-slate-800">{contact.name}</div>
                                        <div className="text-xs text-slate-500">{contact.niche}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{contact.platform}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <RelationshipScore score={contact.relationshipScore} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {contact.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(contact.lastContacted).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button onClick={(e) => handleDeleteContact(e, contact.id)} className="text-slate-500 hover:text-red-600">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {contacts.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <p>No media contacts yet.</p>
                            <p className="text-sm">Add contacts from the Influencer & Media Discovery tool.</p>
                        </div>
                    )}
                </div>
            </Card>
            {selectedContact && <EditContactModal 
                contact={selectedContact} 
                onClose={() => setSelectedContact(null)} 
                onSave={handleSaveContact}
                onAddInteraction={handleAddInteraction}
                brandName={activeWorkspace.brandName}
                currentUser={currentUser}
                activeWorkspace={activeWorkspace}
            />}
        </div>
    );
};

export default StrategicMediaRelations;