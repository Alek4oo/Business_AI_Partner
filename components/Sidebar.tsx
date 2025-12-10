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
  X
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
    { id: Section.DASHBOARD, label: 'Начало', icon: LayoutDashboard },
    { id: Section.MENTOR, label: 'AI Ментор', icon: MessageCircle }, 
    { id: Section.IDEA_VALIDATION, label: 'Валидация', icon: Lightbulb },
    { id: Section.MARKET_ANALYSIS, label: 'Пазар', icon: TrendingUp },
    { id: Section.BUSINESS_PLAN, label: 'Бизнес План', icon: FileText },
    { id: Section.FINANCE, label: 'Финанси', icon: DollarSign },
    { id: Section.MARKETING, label: 'Маркетинг', icon: Megaphone },
    { id: Section.LEGAL, label: 'Закони', icon: Scale },
    { id: Section.RISKS, label: 'Roadmap', icon: AlertTriangle },
  ];

  return (
    <div 
      className={`fixed left-0 top-0 h-full w-64 bg-slate-950 text-slate-300 shadow-2xl z-30 transform transition-transform duration-300 ease-in-out border-r border-slate-800 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-6 border-b border-slate-800 flex justify-between items-center relative">
        <div>
            <h1 className="text-2xl font-bold text-white">
            Biz<span className="text-amber-400">AI</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Premium Assistant</p>
        </div>
        <button 
            onClick={onClose} 
            className="lg:hidden text-slate-400 hover:text-amber-400 transition"
        >
            <X size={24} />
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto h-[calc(100vh-140px)] scrollbar-hide">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-amber-400 text-black font-bold shadow-[0_0_15px_rgba(251,191,36,0.3)]' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-amber-400'
              }`}
            >
              <Icon size={20} className={`transition-colors ${isActive ? 'text-black' : 'group-hover:text-amber-400'}`} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-950">
        <button 
          onClick={onLogout}
          className="w-full text-left px-4 py-2 text-sm text-slate-500 hover:text-amber-400 transition-colors flex items-center gap-2"
        >
          <span>Изход / Нова Идея</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;