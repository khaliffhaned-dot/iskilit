import * as React from 'react';
import { NAV_SEGMENTS } from '../constants.tsx';
import { Page, Workspace, User } from '../types.ts';
import CreateWorkspaceForm from './CreateWorkspaceForm.tsx';
import Logo from './Logo.tsx';

interface SidebarProps {
  activePage: Page | string;
  setActivePage: (page: Page | string) => void;
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
  onLogout: () => void;
  currentUser: User;
  activeWorkspace: Workspace | null;
  workspaces: Workspace[];
  onWorkspaceChange: (workspaceId: string) => void;
  onWorkspaceCreate: (name: string, brandName: string, competitors: string[]) => void;
}

const CustomLogo: React.FC<{ logoUrl?: string | null; isExpanded: boolean }> = ({ logoUrl, isExpanded }) => {
    if (logoUrl && isExpanded) {
        return <img src={logoUrl} alt="Agency Logo" className="h-8 w-auto max-w-[150px] object-contain" />;
    }
    if (isExpanded) {
        return <Logo />;
    }
    return (
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-red-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-md">
            E
        </div>
    );
}

const WorkspaceSwitcher: React.FC<{
    workspaces: Workspace[];
    activeWorkspace: Workspace | null;
    onWorkspaceChange: (workspaceId: string) => void;
    onWorkspaceCreate: (name: string, brandName: string, competitors: string[]) => void;
    branding?: User['branding'];
    isExpanded: boolean;
}> = ({ workspaces, activeWorkspace, onWorkspaceChange, onWorkspaceCreate, branding, isExpanded }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!activeWorkspace) return null;
    
    const handleCreate = (name: string, brandName: string, competitors: string[]) => {
        onWorkspaceCreate(name, brandName, competitors);
        setIsCreateModalOpen(false);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className={`p-4 border-b border-slate-200 ${!isExpanded && 'flex justify-center'}`}>
                <CustomLogo logoUrl={branding?.logoUrl} isExpanded={isExpanded} />
            </div>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-100 transition-colors border-b border-slate-200">
                <div className="flex items-center gap-3 overflow-hidden">
                     <div className="w-9 h-9 bg-slate-200 rounded-lg flex items-center justify-center text-slate-700 font-bold text-lg flex-shrink-0">
                        {activeWorkspace.name.charAt(0)}
                    </div>
                    <div className="sidebar-text">
                        <p className="font-bold text-slate-800 truncate">{activeWorkspace.name}</p>
                    </div>
                </div>
                <svg className={`h-5 w-5 text-slate-500 transition-transform sidebar-chevron flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute top-full mt-1 w-full bg-white rounded-md shadow-lg p-2 z-50 border border-slate-200">
                    {workspaces.map(ws => (
                        <button key={ws.id} onClick={() => { onWorkspaceChange(ws.id); setIsOpen(false); }}
                            className={`w-full text-left p-2 rounded-md flex items-center gap-3 ${activeWorkspace.id === ws.id ? 'bg-amber-500/10 text-amber-600' : 'hover:bg-slate-100'}`}>
                            <div className="w-8 h-8 bg-slate-200 rounded-md flex items-center justify-center text-slate-700 font-bold text-sm flex-shrink-0">{ws.name.charAt(0)}</div>
                            <span className="font-medium text-slate-800">{ws.name}</span>
                        </button>
                    ))}
                     <div className="border-t border-slate-200 my-2"></div>
                    <button onClick={() => { setIsCreateModalOpen(true); setIsOpen(false); }} className="w-full text-left p-2 rounded-md hover:bg-slate-100 text-slate-600 font-medium">
                        + Create New Workspace
                    </button>
                </div>
            )}
            {isCreateModalOpen && 
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={() => setIsCreateModalOpen(false)}>
                    <div className="w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <CreateWorkspaceForm onCreate={handleCreate} isLoading={false} />
                    </div>
                </div>
            }
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isExpanded, setIsExpanded, onLogout, currentUser, activeWorkspace, workspaces, onWorkspaceChange, onWorkspaceCreate }) => {
    
    return (
        <aside 
            className={`fixed inset-y-0 left-0 bg-white border-r border-slate-200 flex flex-col z-50 sidebar-container ${isExpanded ? 'w-72' : 'w-20'}`}
        >
            <div className={`${!isExpanded && 'sidebar-collapsed'}`}>
                <WorkspaceSwitcher
                    workspaces={workspaces}
                    activeWorkspace={activeWorkspace}
                    onWorkspaceChange={onWorkspaceChange}
                    onWorkspaceCreate={onWorkspaceCreate}
                    branding={currentUser.branding}
                    isExpanded={isExpanded}
                />
            </div>
            
            <nav className="flex-1 w-full overflow-y-auto p-4 space-y-6">
                {NAV_SEGMENTS.map((segment) => (
                    <div key={segment.title} className={`${!isExpanded && 'sidebar-collapsed'} mb-6`}>
                        <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider sidebar-text">{segment.title}</h3>
                        <ul className="mt-2 space-y-1">
                            {segment.items.map((item) => (
                                <li key={item.name as string} title={!isExpanded ? (item.displayName || (item.name as string)) : undefined}>
                                    <button
                                        onClick={() => setActivePage(item.name)}
                                        className={`w-full text-left p-3 rounded-lg flex items-center gap-4 transition-all duration-200 border-l-4 ${
                                            activePage === item.name 
                                                ? 'bg-amber-500/10 text-amber-600 border-amber-500' 
                                                : 'text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900'
                                        } ${!isExpanded ? 'justify-center border-l-0' : ''}`}
                                    >
                                        <span className="flex-shrink-0 w-6 h-6">{item.icon}</span>
                                        <span className="font-semibold text-sm sidebar-text">{item.displayName || item.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
            <div className={`p-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-amber-500/5 hover:from-amber-500/10 hover:to-orange-500/5 transition-all duration-300 ${!isExpanded && 'sidebar-collapsed'}`}>
                <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 bg-gradient-to-tr from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center font-bold text-base flex-shrink-0 ring-2 ring-amber-500/20 shadow-sm transition-transform duration-300 hover:scale-105">
                            {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                        </div>
                        <div className="sidebar-text">
                            <div className="flex items-center gap-1.5">
                                <p className="font-bold text-sm text-slate-800 truncate">{currentUser.name || 'User'}</p>
                                <span className="px-1.5 py-0.5 text-[9px] bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded font-black uppercase tracking-wider">Enterprise</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">{currentUser.email || 'No email provided'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                         <button onClick={() => setActivePage('Settings')} aria-label="Settings" className="text-slate-400 hover:text-amber-600 hover:bg-amber-50 p-2 rounded-full transition-all duration-300 hover:rotate-45">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                         <button onClick={onLogout} aria-label="Logout" className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;