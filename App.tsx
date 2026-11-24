import * as React from 'react';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './contexts/pages/Dashboard.tsx';
import CompetitorAnalysis from './contexts/pages/CompetitorAnalysis.tsx';
import InfluencerDiscovery from './contexts/pages/InfluencerDiscovery.tsx';
import ContentStudio from './contexts/pages/ContentStudio.tsx';
import CampaignPlanner from './contexts/pages/CampaignPlanner.tsx';
import LandingPage from './contexts/pages/LandingPage.tsx';
import Footer from './components/Footer.tsx';
import { Page, User, ActivePage, Workspace } from './types.ts';
import * as cloudService from './services/cloudService.ts';
import BrandReputation from './contexts/pages/BrandReputation.tsx';
import Settings from './contexts/pages/Settings.tsx';
import { useAuth } from './contexts/AuthContext.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import CreateWorkspaceForm from './components/CreateWorkspaceForm.tsx';
import Logo from './components/Logo.tsx';
import ClientReporting from './contexts/pages/ClientReporting.tsx';
import NarrativeSimulator from './contexts/pages/NarrativeSimulator.tsx';
import StrategicMediaRelations from './contexts/pages/StrategicMediaRelations.tsx';
import ContentSafetyAndIntegrity from './contexts/pages/ContentSafetyAndIntegrity.tsx';
import StakeholderMapping from './contexts/pages/StakeholderMapping.tsx';
import RegulatoryRadar from './contexts/pages/RegulatoryRadar.tsx';
import EventIntelligence from './contexts/pages/EventIntelligence.tsx';
import CrisisSimulator from './contexts/pages/CrisisSimulator.tsx';
import NarrativeForesight from './contexts/pages/NarrativeForesight.tsx';
import AISearchVisibility from './contexts/pages/AISearchVisibility.tsx';
import FactCheckCenter from './contexts/pages/FactCheckCenter.tsx';
import ModelIndicator from './components/ModelIndicator.tsx';

const App: React.FC = () => {
  const { currentUser, authLoading, logOut } = useAuth();
  const [activeWorkspace, setActiveWorkspace] = React.useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([]);
  const [activePage, setActivePage] = React.useState<ActivePage>({ page: 'Dashboard' });
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(true);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = React.useState(false);
  const [appReady, setAppReady] = React.useState(false);

  // Effect to fetch user's workspaces and set the active one
  React.useEffect(() => {
    const manageWorkspace = async () => {
      if (currentUser?.uid) {
        setAppReady(false);
        const userWorkspaces = await cloudService.getWorkspacesForUser(currentUser.uid);
        setWorkspaces(userWorkspaces);
        
        if (userWorkspaces.length > 0) {
            const currentActiveId = await cloudService.getActiveWorkspaceId(currentUser.uid);
            const workspaceToActivate = userWorkspaces.find(ws => ws.id === currentActiveId) || userWorkspaces[0];
            setActiveWorkspace(workspaceToActivate);
            if (workspaceToActivate.id !== currentActiveId) {
                await cloudService.setActiveWorkspaceId(currentUser.uid, workspaceToActivate.id);
            }
        } else {
            setActiveWorkspace(null); // No workspaces exist
        }
        setAppReady(true);
      } else {
        setActiveWorkspace(null);
        setWorkspaces([]);
        setAppReady(true);
      }
    };
    manageWorkspace();
  }, [currentUser]);
  
  
  const handleLogout = () => {
      logOut();
      setActivePage({ page: 'Dashboard' });
  };

  const handleWorkspaceChange = async (workspaceId: string) => {
    if(currentUser) {
        await cloudService.setActiveWorkspaceId(currentUser.uid, workspaceId);
        const newActive = workspaces.find(ws => ws.id === workspaceId);
        setActiveWorkspace(newActive || null);
        setActivePage({ page: 'Dashboard' }); // Reset to dashboard on workspace switch
    }
  };
  
  const handleInitialWorkspaceCreate = async (name: string, brandName: string, competitors: string[]) => {
    if (currentUser) {
        setIsCreatingWorkspace(true);
        try {
            const newWorkspace = await cloudService.createWorkspace(currentUser, name, brandName, competitors);
            setWorkspaces(prev => [...prev, newWorkspace]);
            setActiveWorkspace(newWorkspace);
            setActivePage({ page: 'Dashboard' });
        } catch (error) {
            console.error("Failed to create workspace:", error);
        } finally {
            setIsCreatingWorkspace(false);
        }
    }
  };

  const handleUpdateUser = async (user: User) => {
    // In a real app, this would also refresh the currentUser from AuthContext
    console.log("User profile updated (mock):", user);
  };

  const renderPage = (page: Page | string, payload?: any) => {
    if (!currentUser || !activeWorkspace) return null;

    switch (page) {
      case 'Dashboard': return <Dashboard setActivePage={setActivePage} activeWorkspace={activeWorkspace} currentUser={currentUser} />;
      case 'Competitive Analysis': return <CompetitorAnalysis payload={payload} activeWorkspace={activeWorkspace} currentUser={currentUser} />;
      case 'Influencer & Media Discovery': return <InfluencerDiscovery setActivePage={setActivePage} activeWorkspace={activeWorkspace} currentUser={currentUser} />;
      case 'Content Studio': return <ContentStudio setActivePage={setActivePage} activeWorkspace={activeWorkspace} currentUser={currentUser} />;
      case 'Campaign Planner': return <CampaignPlanner activeWorkspace={activeWorkspace} currentUser={currentUser} />;
      case 'Brand Reputation': return <BrandReputation activeWorkspace={activeWorkspace} currentUser={currentUser} />;
      case 'Client Reporting': return <ClientReporting activeWorkspace={activeWorkspace} currentUser={currentUser} />;
      case 'Narrative Simulator': return <NarrativeSimulator payload={payload} activeWorkspace={activeWorkspace} currentUser={currentUser} />;
      case 'Strategic Media Relations': return <StrategicMediaRelations activeWorkspace={activeWorkspace} currentUser={currentUser} />;
      case 'Content Safety & Integrity': return <ContentSafetyAndIntegrity />;
      case 'Stakeholder Mapping': return <StakeholderMapping activeWorkspace={activeWorkspace} currentUser={currentUser} />;
      case 'Regulatory Radar': return <RegulatoryRadar activeWorkspace={activeWorkspace} currentUser={currentUser} />;
      case 'Settings': return <Settings currentUser={currentUser} onUpdateUser={handleUpdateUser} />;
      case 'Event Intelligence': return <EventIntelligence activeWorkspace={activeWorkspace} currentUser={currentUser} />;
      case 'Narrative Foresight': return <NarrativeForesight activeWorkspace={activeWorkspace} currentUser={currentUser} />;
      case 'Interactive Crisis Simulator': return <CrisisSimulator activeWorkspace={activeWorkspace} currentUser={currentUser} />;
      case 'AI Search Visibility': return <AISearchVisibility activeWorkspace={activeWorkspace} currentUser={currentUser} />;
      case 'FactCheckCenter': return <FactCheckCenter activeWorkspace={activeWorkspace} currentUser={currentUser} />;
      default: return <Dashboard setActivePage={setActivePage} activeWorkspace={activeWorkspace} currentUser={currentUser}/>;
    }
  };

  if (authLoading || !appReady) {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-900">
            <Logo className="mb-4" />
            <LoadingSpinner />
        </div>
    );
  }

  if (!currentUser) {
    return <LandingPage />;
  }

  if (!activeWorkspace) {
     return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-off-white text-slate-800 p-4">
             <Logo className="mb-4" />
             <p className="mb-4 text-center">Welcome! Let's set up your first workspace.</p>
             <div className="w-full max-w-sm">
                <CreateWorkspaceForm onCreate={handleInitialWorkspaceCreate} isLoading={isCreatingWorkspace} />
             </div>
        </div>
     );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
        <Sidebar 
          activePage={activePage.page} 
          setActivePage={(page) => setActivePage({ page })} 
          isExpanded={isSidebarExpanded} 
          setIsExpanded={setIsSidebarExpanded} 
          onLogout={handleLogout}
          currentUser={currentUser}
          activeWorkspace={activeWorkspace}
          workspaces={workspaces}
          onWorkspaceChange={handleWorkspaceChange}
          onWorkspaceCreate={handleInitialWorkspaceCreate}
        />
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarExpanded ? 'md:ml-72' : 'md:ml-20'}`}>
            <header className="flex items-center justify-between h-16 px-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 flex-shrink-0 sticky top-0 z-20">
                <div className="flex items-center">
                    <button onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="p-2 mr-4 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold text-slate-800 truncate lg:ml-2">{activePage.page}</h1>
                </div>
                <div className="flex items-center gap-3 pr-2">
                    <ModelIndicator />
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-indigo-50/50 relative overflow-x-hidden">
                {/* Ambient glow blobs to amplify glassmorphism depth */}
                <div className="absolute top-[5%] left-[5%] w-[45%] h-[35%] rounded-full bg-blue-300/15 blur-[120px] pointer-events-none z-0" />
                <div className="absolute bottom-[15%] right-[5%] w-[40%] h-[40%] rounded-full bg-amber-200/10 blur-[130px] pointer-events-none z-0" />
                <div className="absolute top-[45%] left-[55%] w-[35%] h-[35%] rounded-full bg-indigo-300/12 blur-[110px] pointer-events-none z-0" />
                <div className="absolute bottom-[45%] left-[-10%] w-[35%] h-[35%] rounded-full bg-teal-200/10 blur-[120px] pointer-events-none z-0" />
                
                <div className="relative z-10">
                    {renderPage(activePage.page, activePage.payload)}
                </div>
            </main>
            <Footer />
        </div>
    </div>
  );
};

export default App;