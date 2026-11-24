import * as React from 'react';
import Card from './Card.tsx';

interface CreateWorkspaceFormProps {
  onCreate: (name: string, brandName: string, competitors: string[]) => void;
  isLoading: boolean;
}

const CreateWorkspaceForm: React.FC<CreateWorkspaceFormProps> = ({ onCreate, isLoading }) => {
  const [name, setName] = React.useState('');
  const [brandName, setBrandName] = React.useState('');
  const [selectedCompetitors, setSelectedCompetitors] = React.useState<string[]>([]);
  
  const popularCompetitors = ['Globex Inc', 'Stark Industries', 'Wayne Enterprises', 'Cyberdyne Systems'];

  const handleCompetitorToggle = (competitor: string) => {
    setSelectedCompetitors(prev => 
      prev.includes(competitor) ? prev.filter(c => c !== competitor) : [...prev, competitor]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brandName.trim() || isLoading) {
      return;
    }
    onCreate(name, brandName, selectedCompetitors);
  };

  const inputClass = "w-full p-3 border rounded-lg bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none focus:border-amber-500 transition-colors";
  const labelClass = "block text-sm font-bold text-slate-700 mb-2";

  return (
    <Card title="Create a Workspace" titleClassName="text-center !text-2xl">
      <p className="text-center text-slate-500 mb-6 -mt-2">A workspace contains all the intelligence and tools for a specific brand or client.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ws-name" className={labelClass}>Workspace Name</label>
          <input id="ws-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Acme Corp Q3 Campaign" className={inputClass} required />
        </div>
        <div>
          <label htmlFor="ws-brand" className={labelClass}>Your Brand/Client Name</label>
          <input id="ws-brand" type="text" value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="e.g., Acme Corporation" className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Key Competitors</label>
          <div className="grid grid-cols-2 gap-2">
            {popularCompetitors.map(competitor => (
              <label key={competitor} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-300">
                <input
                  type="checkbox"
                  checked={selectedCompetitors.includes(competitor)}
                  onChange={() => handleCompetitorToggle(competitor)}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                {competitor}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" disabled={isLoading} className="w-full btn btn-primary mt-6 !py-3 !text-base !font-bold">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              <span>Creating...</span>
            </div>
          ) : (
            'Create Workspace'
          )}
        </button>
      </form>
    </Card>
  );
};

export default CreateWorkspaceForm;
