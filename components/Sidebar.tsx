import React from 'react';
import { Section } from '../types';
import {
  LayoutDashboard,
  Lightbulb,
  TrendingUp,
  FileText,
  DollarSign,
  Megaphone,
  Scale,
  AlertTriangle,
  MessageCircle,
  X,
  ArrowRight
} from 'lucide-react';

interface SidebarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, onLogout, isOpen, onClose }) => {
  const menuItems = [
    { id: Section.DASHBOARD, label: 'Home', icon: LayoutDashboard },
    { id: Section.MENTOR, label: 'AI Mentor', icon: MessageCircle },
    { id: Section.IDEA_VALIDATION, label: 'Validation', icon: Lightbulb },
    { id: Section.MARKET_ANALYSIS, label: 'Market', icon: TrendingUp },
    { id: Section.BUSINESS_PLAN, label: 'Business Plan', icon: FileText },
    { id: Section.FINANCE, label: 'Finance', icon: DollarSign },
    { id: Section.MARKETING, label: 'Marketing', icon: Megaphone },
    { id: Section.LEGAL, label: 'Legal', icon: Scale },
    { id: Section.RISKS, label: 'Roadmap', icon: AlertTriangle },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed left-0 top-0 h-full w-72 glass-panel z-30 transform transition-all duration-300 ease-out border-r border-white/10 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="p-8 flex justify-between items-center relative">
          <div className="relative group cursor-default">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <h1 className="relative text-3xl font-bold text-white tracking-tight">
              ApexBusiness<span className="text-amber-400"><br></br>Intelligence</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.2em] font-medium ml-1">Future Of Business</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-amber-400 transition hover:bg-white/5 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto h-[calc(100vh-180px)] scrollbar-hide py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-amber-300'
                  }`}
              >
                {/* Active Background Glow */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent border-l-4 border-amber-400 animate-pulse"></div>
                )}

                {/* Hover Background */}
                <div className={`absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? 'hidden' : ''}`}></div>

                <Icon
                  size={20}
                  className={`relative z-10 transition-transform duration-300 ${isActive ? 'text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'group-hover:text-amber-400 group-hover:scale-105'
                    }`}
                />
                <span className={`relative z-10 text-sm font-medium tracking-wide ${isActive ? 'text-shadow-glow' : ''}`}>
                  {item.label}
                </span>

                {isActive && (
                  <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,1)]"></div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/5 bg-gradient-to-t from-slate-900/90 to-transparent backdrop-blur-sm">
          <button
            onClick={onLogout}
            className="w-full group flex items-center justify-between px-5 py-3 rounded-xl hover:bg-white/5 transition-all text-slate-400 hover:text-white border border-transparent hover:border-white/5"
          >
            <span className="text-sm font-medium group-hover:text-amber-400 transition-colors">Logout</span>
            <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-amber-400" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;