import * as React from 'react';
import { NAV_SEGMENTS } from '../constants.tsx';
import { Page, NavItem } from '../types.ts';

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setActivePage: (page: Page | string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, setIsOpen, setActivePage }) => {
  const [search, setSearch] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const allPages = React.useMemo(() => NAV_SEGMENTS.flatMap(segment => segment.items), []);

  const filteredPages = React.useMemo(() => {
    if (!search) return allPages;
    return allPages.filter(page =>
      (page.displayName || page.name).toLowerCase().includes(search.toLowerCase())
    );
  }, [search, allPages]);
  
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [filteredPages]);

  const handleSelect = React.useCallback((page: Page | string) => {
    setActivePage(page);
    setIsOpen(false);
    setSearch('');
  }, [setActivePage, setIsOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredPages.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (filteredPages.length || 1)) % (filteredPages.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredPages[selectedIndex]) {
          handleSelect(filteredPages[selectedIndex].name);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredPages, selectedIndex, handleSelect]);

  React.useEffect(() => {
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-slate-500/30 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div 
        className="w-full max-w-lg bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-3 border-b border-slate-200 flex items-center gap-3">
          <svg className="h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search for a tool or page..."
            className="w-full bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        <ul className="max-h-96 overflow-y-auto p-2">
          {filteredPages.length > 0 ? filteredPages.map((item, index) => (
            <li key={item.name as string}>
              <button
                onClick={() => handleSelect(item.name)}
                className={`w-full text-left p-3 rounded-lg flex items-center gap-4 transition-colors ${
                  index === selectedIndex ? 'bg-amber-500/10' : 'hover:bg-slate-100'
                }`}
              >
                <span className={index === selectedIndex ? 'text-amber-600' : 'text-slate-500'}>{React.cloneElement(item.icon, {className: 'w-5 h-5'})}</span>
                <span className={`font-medium ${index === selectedIndex ? 'text-amber-600' : 'text-slate-700'}`}>{item.displayName || item.name}</span>
              </button>
            </li>
          )) : (
            <li className="p-8 text-center text-slate-500">No results found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CommandPalette;