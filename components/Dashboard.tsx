import React, { useState, useEffect, useRef } from 'react';
import { Section, UserProfile, FinancialDataPoint, RisksAndRoadmapData, RoadmapTask, ChatMessage } from '../types';
import * as GeminiService from '../services/geminiService';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    Loader2,
    RefreshCw,
    TrendingUp,
    Wallet,
    MapPin,
    CheckCircle,
    DollarSign,
    Lightbulb,
    FileText,
    Megaphone,
    Scale,
    AlertTriangle,
    Activity,
    Hourglass,
    PieChart,
    Users,
    MessageCircle,
    Send,
    CheckSquare,
    Sparkles,
    ArrowRight,
    Maximize2,
    LogOut,
    Settings,
    User,
    ChevronDown
} from 'lucide-react';

import ProfileSettings from './ProfileSettings';
import SettingsModal from './SettingsModal';
import ActionBar from './ActionBar';

interface DashboardProps {
    activeSection: Section;
    userProfile: UserProfile;
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ activeSection, userProfile, onLogout }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Record<string, any>>({});
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<'profile' | 'settings' | null>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Update local profile state
    const handleProfileUpdate = (updatedProfile: UserProfile) => {
        // In a real app, this would update parent state or context
        // For now we just refresh the section if needed
        console.log('Profile updated:', updatedProfile);
    };

    // Chat State
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Roadmap State (Local persistence simulation)
    const [roadmapTasks, setRoadmapTasks] = useState<RoadmapTask[]>([]);

    // Cache check helper
    const hasData = (section: Section) => !!data[section];

    useEffect(() => {
        if (!hasData(activeSection) && activeSection !== Section.DASHBOARD && activeSection !== Section.MENTOR) {
            fetchDataForSection(activeSection);
        }
    }, [activeSection]);

    // Scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, activeSection]);

    const fetchDataForSection = async (section: Section) => {
        setLoading(true);
        try {
            let result;
            switch (section) {
                case Section.IDEA_VALIDATION:
                    result = await GeminiService.generateIdeaValidation(userProfile);
                    break;
                case Section.MARKET_ANALYSIS:
                    result = await GeminiService.generateMarketAnalysis(userProfile);
                    break;
                case Section.BUSINESS_PLAN:
                    result = await GeminiService.generateBusinessPlan(userProfile);
                    break;
                case Section.FINANCE:
                    result = await GeminiService.generateFinancialForecast(userProfile);
                    break;
                case Section.MARKETING:
                    result = await GeminiService.generateMarketingStrategy(userProfile);
                    break;
                case Section.LEGAL:
                    result = await GeminiService.checkLegalCompliance(userProfile);
                    break;
                case Section.RISKS:
                    const risksData = await GeminiService.generateRisksAndRoadmap(userProfile);
                    result = risksData;
                    if (risksData.roadmap) setRoadmapTasks(risksData.roadmap);
                    break;
                default:
                    break;
            }
            setData(prev => ({ ...prev, [section]: result }));
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;

        const userMsg: ChatMessage = { role: 'user', text: chatInput };
        setChatHistory(prev => [...prev, userMsg]);
        setChatInput('');
        setIsChatLoading(true);

        try {
            const responseText = await GeminiService.sendMentorMessage(userProfile, chatHistory, userMsg.text);
            const aiMsg: ChatMessage = { role: 'model', text: responseText };
            setChatHistory(prev => [...prev, aiMsg]);
        } catch (e) {
            console.error(e);
        } finally {
            setIsChatLoading(false);
        }
    };

    const toggleTask = (taskId: number) => {
        setRoadmapTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
        ));
    };

    const renderContent = (content: string) => {
        if (!content) return null;
        return content.split('\n').map((line, idx) => {
            if (line.startsWith('###') || (line.startsWith('**') && line.endsWith('**'))) {
                return <h3 key={idx} className="text-xl font-bold text-white mt-8 mb-4 border-l-4 border-amber-400 pl-4">{line.replace(/#/g, '').replace(/\*\*/g, '')}</h3>;
            }
            if (line.startsWith('1.') || line.startsWith('-')) {
                return <li key={idx} className="ml-4 list-none text-slate-300 mb-2 leading-relaxed flex items-start gap-2">
                    <span className="text-amber-500 mt-1.5">•</span>
                    <span>{line.replace(/^[0-9\-\.\s]+/, '')}</span>
                </li>;
            }
            if (line.trim() === '') return <br key={idx} />;
            return <p key={idx} className="text-slate-300 mb-2 leading-relaxed">{line}</p>;
        });
    };

    // Helper to calculate dummy stats
    const calculateStats = () => {
        const baseBurnPerPerson = 1200; // Estimated monthly cost per person
        const baseOpsCost = 500; // Fixed ops cost
        const monthlyBurn = (userProfile.teamSize * baseBurnPerPerson) + baseOpsCost;
        const runway = Math.max(0, Math.floor(userProfile.capital / monthlyBurn));

        let baseScore = 60;
        if (userProfile.experience === 'Expert') baseScore += 25;
        if (userProfile.experience === 'Intermediate') baseScore += 10;
        if (runway > 6) baseScore += 10;
        if (userProfile.capital > 10000) baseScore += 5;
        const viabilityScore = Math.min(99, baseScore);

        return { monthlyBurn, runway, viabilityScore };
    };

    const renderSection = () => {
        if (activeSection === Section.DASHBOARD) {
            const stats = calculateStats();
            const quotes = [
                "Great things never come from comfort zones.",
                "Don't wait for opportunity. Create it.",
                "Success is the sum of small efforts, repeated day after day.",
                "Failure is just an opportunity to start again, smarter."
            ];
            const dailyQuote = quotes[Math.floor(Math.random() * quotes.length)];

            return (
                <div className="animate-fadeIn pb-10">
                    {/* Welcome Hero - Glass Effect */}
                    <div className="glass-panel rounded-2xl p-8 relative overflow-hidden group mb-8">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-amber-400/10 to-transparent rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl font-bold mb-3 text-white tracking-tight">
                                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">{userProfile.name}</span>
                            </h2>
                            <p className="text-lg text-slate-300 max-w-2xl font-light">
                                Your business <span className="font-semibold text-amber-300">"{userProfile.businessIdea}"</span> is ready for the next level.
                            </p>
                        </div>
                    </div>

                    {/* Daily Insight Card */}
                    <div className="glass-card p-6 rounded-xl mb-8 flex items-center gap-5 border-l-4 border-l-amber-400">
                        <div className="p-4 bg-amber-400/10 rounded-full text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-amber-400 uppercase text-xs tracking-widest mb-1">Daily AI Insight</h4>
                            <p className="text-slate-200 italic font-medium leading-relaxed">"{dailyQuote}"</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="flex items-center gap-3 mb-6">
                        <Activity size={20} className="text-amber-400" />
                        <h3 className="text-white font-bold text-lg tracking-wide">Key Indicators</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Card 1: Capital */}
                        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-6 right-6 p-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg text-amber-400 shadow-lg group-hover:scale-110 transition-transform">
                                <Wallet size={20} />
                            </div>
                            <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 bg-slate-800/50 px-2 py-1 rounded">Capital</span>
                            <p className="text-3xl font-bold text-white mb-1 group-hover:text-glow transition-all">
                                {userProfile.capital.toLocaleString()} <span className="text-lg text-slate-500 font-normal">BGN</span>
                            </p>
                            <div className="w-full bg-slate-800/50 h-1.5 rounded-full mt-4 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 w-3/4 rounded-full"></div>
                            </div>
                        </div>

                        {/* Card 2: Runway */}
                        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-6 right-6 p-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg text-emerald-400 shadow-lg group-hover:scale-110 transition-transform">
                                <Hourglass size={20} />
                            </div>
                            <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 bg-slate-800/50 px-2 py-1 rounded">Runway</span>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-bold text-white mb-1 group-hover:text-glow transition-all">{stats.runway}</p>
                                <span className="text-sm text-slate-500 font-medium">months</span>
                            </div>
                            <div className="w-full bg-slate-800/50 h-1.5 rounded-full mt-4 overflow-hidden">
                                <div className="h-full bg-emerald-500 w-1/2 rounded-full"></div>
                            </div>
                        </div>

                        {/* Card 3: Viability Score */}
                        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-6 right-6 p-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg text-indigo-400 shadow-lg group-hover:scale-110 transition-transform">
                                <PieChart size={20} />
                            </div>
                            <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 bg-slate-800/50 px-2 py-1 rounded">AI Score</span>
                            <div className="flex items-center gap-3">
                                <p className="text-3xl font-bold text-white group-hover:text-glow transition-all">{stats.viabilityScore}%</p>
                                <div className="flex px-2 py-0.5 bg-indigo-500/20 rounded text-indigo-300 text-xs font-bold border border-indigo-500/30">
                                    +2.4%
                                </div>
                            </div>
                            <div className="w-full bg-slate-800/50 h-1.5 rounded-full mt-4 overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${stats.viabilityScore}%` }}></div>
                            </div>
                        </div>

                        {/* Card 4: Burn Rate */}
                        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-6 right-6 p-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg text-rose-500 shadow-lg group-hover:scale-110 transition-transform">
                                <TrendingUp size={20} className="rotate-180" />
                            </div>
                            <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 bg-slate-800/50 px-2 py-1 rounded">Burn Rate</span>
                            <p className="text-2xl font-bold text-white mb-1 group-hover:text-glow transition-all">
                                ~{stats.monthlyBurn.toLocaleString()} <span className="text-sm text-slate-500 font-normal">BGN/mo</span>
                            </p>
                        </div>

                        {/* Card 5: Team */}
                        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-6 right-6 p-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg text-slate-300 shadow-lg group-hover:scale-110 transition-transform">
                                <Users size={20} />
                            </div>
                            <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 bg-slate-800/50 px-2 py-1 rounded">Team</span>
                            <p className="text-3xl font-bold text-white mb-1 group-hover:text-glow transition-all">
                                {userProfile.teamSize} <span className="text-lg text-slate-500 font-normal">people</span>
                            </p>
                        </div>

                        {/* Card 6: Location/Experience */}
                        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group border-amber-500/30">
                            <div className="absolute top-6 right-6 p-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg text-amber-500 shadow-lg group-hover:scale-110 transition-transform">
                                <MapPin size={20} />
                            </div>
                            <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 bg-slate-800/50 px-2 py-1 rounded">Info</span>
                            <div>
                                <p className="text-lg font-bold text-white truncate group-hover:text-amber-400 transition-colors">{userProfile.location}</p>
                                <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wide flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                                    {userProfile.experience}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (activeSection === Section.MENTOR) {
            return (
                <div className="h-[calc(100vh-140px)] flex flex-col glass-panel rounded-2xl overflow-hidden animate-fadeIn">
                    <div className="bg-slate-900/50 p-4 flex items-center gap-3 border-b border-white/5 backdrop-blur-md">
                        <div className="bg-amber-400/20 p-2 rounded-lg border border-amber-400/30">
                            <MessageCircle size={20} className="text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold tracking-wide">AI Business Mentor</h3>
                            <p className="text-slate-400 text-xs flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                        {chatHistory.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
                                <div className="w-24 h-24 bg-gradient-to-tr from-amber-400/20 to-transparent rounded-full flex items-center justify-center mb-6 animate-pulse">
                                    <Sparkles size={40} className="text-amber-400" />
                                </div>
                                <p className="text-lg font-medium">Ask a question about your business</p>
                            </div>
                        )}
                        {chatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[80%] p-4 rounded-2xl shadow-lg backdrop-blur-sm ${msg.role === 'user'
                                        ? 'bg-amber-500 text-black font-medium rounded-br-none shadow-amber-500/10'
                                        : 'bg-slate-800/60 text-slate-200 rounded-bl-none border border-white/10'
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isChatLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800/60 p-4 rounded-2xl rounded-bl-none border border-white/10">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="p-4 bg-slate-900/80 border-t border-white/5 backdrop-blur-md">
                        <div className="flex gap-2 bg-slate-800/50 p-1.5 rounded-xl border border-white/5 focus-within:border-amber-400/50 transition-colors">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type a message..."
                                className="flex-1 p-3 bg-transparent text-white placeholder-slate-500 focus:outline-none"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isChatLoading || !chatInput.trim()}
                                className="bg-amber-400 hover:bg-amber-300 text-black p-3 rounded-lg transition-colors disabled:opacity-50 disabled:grayscale"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // Loading State
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center h-96 text-center animate-fadeIn">
                    <div className="relative">
                        <div className="w-20 h-20 border-t-2 border-b-2 border-amber-400 rounded-full animate-spin"></div>
                        <div className="w-20 h-20 border-r-2 border-l-2 border-transparent rounded-full animate-spin absolute inset-0 reverse-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 size={30} className="text-amber-400 animate-pulse" />
                        </div>
                    </div>
                    <p className="mt-8 text-xl font-bold text-white tracking-wide">Generating strategy...</p>
                    <p className="text-sm text-slate-400 mt-2">AI is analyzing your data in real-time</p>
                </div>
            );
        }

        // Interactive Roadmap Display
        if (activeSection === Section.RISKS && data[Section.RISKS]?.roadmap) {
            const { risks, roadmap } = data[Section.RISKS] as RisksAndRoadmapData;
            const progress = Math.round((roadmapTasks.filter(t => t.isCompleted).length / roadmapTasks.length) * 100) || 0;

            return (
                <div className="space-y-8 animate-fadeIn pb-20">
                    {/* Header */}
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">Roadmap</h2>
                            <p className="text-slate-400 mt-2">Strategic action plan</p>
                        </div>
                        <div className="text-right">
                            <span className="text-4xl font-bold text-amber-400">{progress}%</span>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">Completed</p>
                        </div>
                    </div>

                    {/* Glass Progress Bar */}
                    <div className="w-full bg-slate-800/30 border border-white/5 rounded-full h-4 mb-10 overflow-hidden relative">
                        <div className="absolute inset-0 bg-slate-800/50"></div>
                        <div className="relative h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all duration-700" style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Roadmap Column */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                    <CheckSquare size={18} />
                                </div>
                                <h3 className="font-bold text-white uppercase text-sm tracking-wider">Tasks</h3>
                            </div>

                            <div className="space-y-3">
                                {roadmapTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        onClick={() => toggleTask(task.id)}
                                        className={`p-5 rounded-xl border transition-all cursor-pointer group flex items-start gap-4 relative overflow-hidden ${task.isCompleted
                                            ? 'bg-emerald-900/5 border-emerald-900/20 opacity-50'
                                            : 'glass-panel hover:border-amber-400/30'
                                            }`}
                                    >
                                        <div className={`mt-1 w-6 h-6 rounded-md border flex items-center justify-center transition-colors shadow-inner ${task.isCompleted ? 'bg-emerald-500 border-emerald-400 text-black' : 'bg-slate-900 border-slate-700 text-transparent group-hover:border-amber-400'
                                            }`}>
                                            <CheckCircle size={14} className={task.isCompleted ? 'scale-100' : 'scale-0'} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-[10px] font-bold text-black bg-amber-400 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(251,191,36,0.3)]">Week {task.week}</span>
                                                <h4 className={`font-bold text-slate-200 ${task.isCompleted ? 'line-through text-slate-500' : 'group-hover:text-amber-100'}`}>{task.title}</h4>
                                            </div>
                                            <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{task.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Risks Column */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                                    <AlertTriangle size={18} />
                                </div>
                                <h3 className="font-bold text-white uppercase text-sm tracking-wider">Risks</h3>
                            </div>
                            {risks.map((risk, idx) => (
                                <div key={idx} className="bg-gradient-to-br from-rose-950/30 to-slate-900/50 p-5 rounded-xl border border-rose-900/20 hover:border-rose-800/50 transition-colors">
                                    <h4 className="font-bold text-rose-400 mb-2 text-sm">{risk.title}</h4>
                                    <p className="text-xs text-rose-200/60 ">{risk.mitigation}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        // Standard Text Layout for other sections (Validation, Market, etc.)
        const sectionData = data[activeSection];
        if (!sectionData) {
            return (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center glass-panel rounded-2xl mx-4 md:mx-0 p-8">
                    <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/5">
                        <RefreshCw size={32} className="text-slate-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Ready for Analysis</h3>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">Start a specialized AI analysis for this section to receive professional guidance.</p>
                    <button
                        onClick={() => fetchDataForSection(activeSection)}
                        className="group relative px-8 py-4 bg-amber-400 text-black font-bold rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative flex items-center gap-2">
                            <Sparkles size={18} />
                            Generate Analysis
                        </span>
                    </button>
                </div>
            );
        }

        // Special Layout for Finance (Charts)
        if (activeSection === Section.FINANCE) {
            const { analysis, data: chartData } = sectionData as { analysis: string, data: FinancialDataPoint[] };
            return (
                <div className="space-y-8 animate-fadeIn pb-20">
                    <div className="glass-panel p-6 md:p-8 rounded-2xl relative">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-amber-400/10 rounded-lg text-amber-500">
                                    <DollarSign size={20} />
                                </div>
                                Financial Forecast (6 Months)
                            </h3>
                            <div className="flex gap-4 text-xs font-semibold text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> Revenue</div>
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-600"></span> Expenses</div>
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span> Profit</div>
                            </div>
                        </div>

                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} barGap={8}>
                                    <defs>
                                        <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#fbbf24" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#d97706" stopOpacity={0.8} />
                                        </linearGradient>
                                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#64748b"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#64748b"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                                        tickFormatter={(value) => `${value / 1000}k`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                        contentStyle={{
                                            backgroundColor: '#0f172a',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
                                            color: '#fff'
                                        }}
                                    />
                                    <Bar dataKey="revenue" name="Revenue" fill="url(#revenueGradient)" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                    <Bar dataKey="expenses" name="Expenses" fill="#334155" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                    <Bar dataKey="profit" name="Profit" fill="url(#profitGradient)" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-panel p-8 rounded-2xl relative overflow-hidden border-emerald-500/20">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>

                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10 text-white">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                                <CheckCircle size={20} />
                            </div>
                            AI Financial Analysis
                        </h3>
                        <div className="prose prose-invert max-w-none relative z-10 text-slate-300 prose-headings:text-emerald-400">
                            {renderContent(analysis)}
                        </div>
                    </div>
                </div>
            );
        }

        // Default Fallback (Text Sections)
        return (
            <div id="report-content" className="glass-panel p-8 md:p-10 rounded-2xl relative backdrop-blur-md mb-20 animate-fadeIn">
                <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 text-amber-400 rounded-2xl shadow-lg border border-white/5">
                            {activeSection === Section.IDEA_VALIDATION && <Lightbulb size={32} />}
                            {activeSection === Section.MARKET_ANALYSIS && <TrendingUp size={32} />}
                            {activeSection === Section.BUSINESS_PLAN && <FileText size={32} />}
                            {activeSection === Section.MARKETING && <Megaphone size={32} />}
                            {activeSection === Section.LEGAL && <Scale size={32} />}
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">
                                {activeSection === Section.IDEA_VALIDATION && 'Idea Validation'}
                                {activeSection === Section.MARKET_ANALYSIS && 'Market Analysis'}
                                {activeSection === Section.BUSINESS_PLAN && 'Business Plan'}
                                {activeSection === Section.MARKETING && 'Marketing Strategy'}
                                {activeSection === Section.LEGAL && 'Legal Requirements'}
                            </h2>
                            <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                                <Sparkles size={14} className="text-amber-400" />
                                Generated by Gemini 2.5 Flash
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <ActionBar
                            sectionId="report-content"
                            sectionName={activeSection.replace('_', '-').toLowerCase()}
                        />
                        <button
                            onClick={() => fetchDataForSection(activeSection)}
                            className="text-slate-400 hover:text-amber-400 transition p-3 hover:bg-white/5 rounded-xl group border border-transparent hover:border-white/5"
                            title="Regenerate"
                        >
                            <RefreshCw size={22} className="group-hover:rotate-180 transition-transform duration-700" />
                        </button>
                    </div>
                </div>
                <div className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-a:text-amber-400 text-slate-300 leading-relaxed">
                    {renderContent(sectionData as string)}
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto pb-4 pt-6">
            <header className="mb-10 lg:flex items-center justify-between hidden z-10 relative">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Project Overview
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Manage and develop your business plan</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-slate-900/50 px-4 py-2 rounded-full border border-white/5 text-xs text-slate-400 flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        System Stable
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="h-10 w-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-black font-bold text-lg shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:scale-105 transition-transform cursor-pointer"
                        >
                            {userProfile.name.charAt(0)}
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3 w-56 glass-panel rounded-xl shadow-2xl border border-white/10 overflow-hidden animate-fadeIn backdrop-blur-xl z-50">
                                <div className="p-4 border-b border-white/5">
                                    <p className="text-sm font-bold text-white truncate">{userProfile.name}</p>
                                    <p className="text-xs text-slate-400 truncate">{userProfile.email}</p>
                                </div>
                                <div className="p-2 space-y-1">
                                    <button
                                        onClick={() => { setIsProfileOpen(false); setActiveModal('profile'); }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left group"
                                    >
                                        <User size={16} className="text-slate-400 group-hover:text-amber-400 transition-colors" />
                                        Profile
                                    </button>
                                    <button
                                        onClick={() => { setIsProfileOpen(false); setActiveModal('settings'); }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left group"
                                    >
                                        <Settings size={16} className="text-slate-400 group-hover:text-amber-400 transition-colors" />
                                        Settings
                                    </button>
                                </div>
                                <div className="p-2 border-t border-white/5">
                                    <button
                                        onClick={onLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            {renderSection()}

            {/* Modals */}
            {activeModal === 'profile' && (
                <ProfileSettings
                    userProfile={userProfile}
                    onClose={() => setActiveModal(null)}
                    onUpdate={handleProfileUpdate}
                />
            )}
            {activeModal === 'settings' && (
                <SettingsModal
                    onClose={() => setActiveModal(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;