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
  const mainContainerClasses = "min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black font-sans overflow-x-hidden";

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
      <div className={`${mainContainerClasses} flex overflow-hidden`}>
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

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
          className={`flex-1 h-screen overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'
            }`}
        >
          <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center gap-4">
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