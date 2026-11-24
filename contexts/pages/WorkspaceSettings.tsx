import * as React from 'react';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import { Workspace } from '../../types.ts';

// A self-contained component for handling tag-like input fields.
const TagInput: React.FC<{ label: string, tags: string[], setTags: (tags: string[]) => void }> = ({ label, tags, setTags }) => {
    const [inputValue, setInputValue] = React.useState('');
    const inputId = `tag-input-${label.toLowerCase().replace(/\s+/g, '-')}`;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setInputValue('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div>
            <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <div className="flex flex-wrap gap-2 items-center p-2 border border-slate-300 rounded-lg bg-white">
                {tags.map(tag => (
                    <div key={tag} className="flex items-center gap-1 bg-slate-200 text-slate-800 text-sm font-medium px-2 py-1 rounded-full">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="text-slate-600 hover:text-slate-900 font-bold">&times;</button>
                    </div>
                ))}
                <input
                    id={inputId}
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type and press Enter..."
                    className="flex-grow bg-transparent focus:outline-none p-1 text-slate-800"
                />
            </div>
        </div>
    );
};


interface WorkspaceSettingsProps {
  activeWorkspace: Workspace;
  onUpdateWorkspace: (workspace: Workspace) => void;
}

const WorkspaceSettings: React.FC<WorkspaceSettingsProps> = ({ activeWorkspace, onUpdateWorkspace }) => {
    const [workspace, setWorkspace] = React.useState<Workspace>(activeWorkspace);
    const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved'>('idle');

    React.useEffect(() => {
        // Deep copy to avoid mutating the original prop
        setWorkspace(JSON.parse(JSON.stringify(activeWorkspace)));
    }, [activeWorkspace]);

    const handleSave = () => {
        setSaveStatus('saving');
        onUpdateWorkspace(workspace);
        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 500);
    };

    const handleFieldChange = (field: keyof Workspace, value: string | string[]) => {
        setWorkspace(prev => ({...prev, [field]: value}));
    }

    const inputClass = "w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none";
    const labelClass = "block text-sm font-medium text-slate-700 mb-1";

    return (
        <div className="fade-in">
            <Header title="Workspace Settings" subtitle={`Customize intelligence parameters for "${activeWorkspace.name}"`} />
            <Card>
                <div className="p-6 space-y-8">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Core Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="brandName" className={labelClass}>Workspace Brand Name</label>
                                <input id="brandName" value={workspace.brandName} onChange={e => handleFieldChange('brandName', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="competitors" className={labelClass}>Comparative Entities (comma-separated)</label>
                                <input id="competitors" value={workspace.competitors.join(', ')} onChange={e => handleFieldChange('competitors', e.target.value.split(',').map(c => c.trim()))} className={inputClass} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Intelligence Feed Tuning</h3>
                        <p className="text-slate-500 mb-4 text-sm">Define keywords, outlets, and handles to prioritize in the Intelligence Feed.</p>
                        <div className="space-y-4">
                            <TagInput label="Tracked Keywords" tags={workspace.trackedKeywords || []} setTags={tags => handleFieldChange('trackedKeywords', tags)} />
                            <TagInput label="Priority Media Outlets (e.g., thestar.com.my)" tags={workspace.priorityOutlets || []} setTags={tags => handleFieldChange('priorityOutlets', tags)} />
                            <TagInput label="Monitored Social Handles (e.g., @anwaribrahim)" tags={workspace.trackedHandles || []} setTags={tags => handleFieldChange('trackedHandles', tags)} />
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-4 pt-6 border-t border-slate-200">
                        {saveStatus === 'saved' && <p className="text-green-600 text-sm font-semibold">Workspace saved!</p>}
                        <button onClick={handleSave} disabled={saveStatus === 'saving'} className="btn btn-primary">
                            {saveStatus === 'saving' ? 'Saving...' : 'Save Workspace'}
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default WorkspaceSettings;