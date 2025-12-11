import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Onboarding from './components/Onboarding';
import LandingPage from './components/LandingPage';
import { UserProfile, Section } from './types';
import { Menu } from 'lucide-react';

type ViewState = 'landing' | 'auth' | 'dashboard';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState<Section>(Section.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>('landing');



  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Check for existing token on mount
  React.useEffect(() => {
    const checkAuth = async () => {
      const { api } = await import('./services/api');
      const profile = await api.getProfile();
      if (profile) {
        setUserProfile(profile);
        setCurrentView('dashboard');
      }
    };
    checkAuth();
  }, []);

  const handleRegistrationComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    import('./services/api').then(({ api }) => api.logout());
    setUserProfile(null);
    setActiveSection(Section.DASHBOARD);
    setCurrentView('landing');
  };
  // Removed strict background to allow body background to show
  const mainContainerClasses = "min-h-screen font-sans overflow-x-hidden text-slate-200";

  if (currentView === 'landing') {
    return (
      <div className={mainContainerClasses}>
        <LandingPage onStart={() => setCurrentView('auth')} />
      </div>
    );
  }

  if (currentView === 'auth') {
    return (
      <div className={mainContainerClasses}>
        <Onboarding onComplete={handleRegistrationComplete} onBack={() => setCurrentView('landing')} />
      </div>
    );
  }

  if (currentView === 'dashboard' && userProfile) {
    return (
      <div className={`${mainContainerClasses} flex`}>
        {/* Mobile Overlay is handled in Sidebar now */}

        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          setActiveSection={(section) => {
            setActiveSection(section);
            // On mobile, close sidebar after selection
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
          }}
          onLogout={handleLogout}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <main
          className={`flex-1 min-h-screen transition-all duration-300 ease-out ${isSidebarOpen ? 'lg:ml-72' : 'ml-0'
            }`}
        >
          {/* Mobile Header - Glass Effect */}
          <div className="lg:hidden sticky top-0 z-20 glass-panel border-b border-white/10 px-6 py-4 flex items-center gap-4 m-4 rounded-xl mt-4">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-white/5 text-slate-300 hover:text-amber-400 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Biz<span className="text-amber-400">AI</span>
            </h1>
          </div>

          <Dashboard
            activeSection={activeSection}
            userProfile={userProfile}
          />
        </main>
      </div>
    );
  }

  return null;
};

export default App;