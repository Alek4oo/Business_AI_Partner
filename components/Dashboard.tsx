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
  ArrowRight
} from 'lucide-react';

interface DashboardProps {
  activeSection: Section;
  userProfile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ activeSection, userProfile }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Record<string, any>>({});
  
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (userProfile.experience === 'Експерт') baseScore += 25;
    if (userProfile.experience === 'Средно ниво') baseScore += 10;
    if (runway > 6) baseScore += 10;
    if (userProfile.capital > 10000) baseScore += 5;
    const viabilityScore = Math.min(99, baseScore);

    return { monthlyBurn, runway, viabilityScore };
  };

  const renderSection = () => {
    if (activeSection === Section.DASHBOARD) {
        const stats = calculateStats();
        // Daily Motivational Quote Logic
        const quotes = [
            "Големите неща никога не идват от зони на комфорт.",
            "Не чакай възможността. Създай я.",
            "Успехът е сумата от малки усилия, повтаряни ден след ден.",
            "Провалът е само възможност да започнеш отново, по-умно."
        ];
        const dailyQuote = quotes[Math.floor(Math.random() * quotes.length)];

        return (
            <div className="animate-fadeIn">
                {/* Welcome Hero */}
                <div className="bg-slate-900/60 backdrop-blur border border-white/10 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden group mb-8">
                    <div className="relative z-10">
                      <h2 className="text-4xl font-bold mb-3">Здравейте, <span className="text-amber-400">{userProfile.name}</span>!</h2>
                      <p className="opacity-90 text-lg text-slate-300 max-w-2xl">
                          Вашият бизнес <span className="font-bold text-amber-300">"{userProfile.businessIdea}"</span> има потенциал. 
                          Нека го превърнем в империя.
                      </p>
                    </div>
                    {/* Golden Circle Decoration */}
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-400/10 rounded-full blur-[100px] group-hover:bg-amber-400/20 transition-all duration-700"></div>
                </div>

                {/* Daily Insight Card */}
                <div className="bg-slate-900 border-l-4 border-amber-400 p-6 rounded-r-xl shadow-md mb-8 flex items-start gap-4 border-y border-r border-white/5">
                    <div className="p-3 bg-amber-400/10 rounded-full text-amber-400">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-1">Дневен Фокус</h4>
                        <p className="text-slate-300 italic font-medium">"{dailyQuote}"</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-amber-500"/>
                    Ключови Показатели
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1: Capital */}
                    <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 border-t-4 border-t-amber-400 hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-400/10 text-amber-400 rounded-xl">
                                <Wallet size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Начален Капитал</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{userProfile.capital.toLocaleString()} <span className="text-sm text-slate-500 font-normal">лв.</span></p>
                    </div>
                    
                    {/* Card 2: Runway */}
                    <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 border-t-4 border-t-emerald-600 hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                                <Hourglass size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Бизнес Runway</span>
                        </div>
                        <div className="flex items-end gap-2">
                            <p className="text-3xl font-bold text-white">{stats.runway}</p>
                            <span className="text-sm text-slate-500 font-medium mb-1">месеца (прогноза)</span>
                        </div>
                    </div>

                    {/* Card 3: Viability Score */}
                    <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 border-t-4 border-t-indigo-500 hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                                <PieChart size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Оценка</span>
                        </div>
                         <div className="flex items-center gap-3">
                            <p className="text-3xl font-bold text-white">{stats.viabilityScore}%</p>
                            <div className="h-2 w-24 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: `${stats.viabilityScore}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Burn Rate */}
                    <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 border-t-4 border-t-rose-500 hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
                                <TrendingUp size={24} className="rotate-180" />
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Est. Burn Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-white">~{stats.monthlyBurn.toLocaleString()} <span className="text-sm text-slate-500 font-normal">лв./мес</span></p>
                    </div>

                    {/* Card 5: Team */}
                    <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 border-t-4 border-t-slate-600 hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-slate-800 text-slate-300 rounded-xl">
                                <Users size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Екип</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{userProfile.teamSize} <span className="text-sm text-slate-500 font-normal">души</span></p>
                    </div>

                    {/* Card 6: Location/Experience */}
                    <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 border-t-4 border-t-amber-500 hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-400/10 text-amber-500 rounded-xl">
                                <MapPin size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Локация & Опит</span>
                        </div>
                        <div>
                             <p className="text-lg font-bold text-white truncate">{userProfile.location}</p>
                             <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wide">{userProfile.experience}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (activeSection === Section.MENTOR) {
        return (
            <div className="h-[calc(100vh-140px)] flex flex-col bg-slate-900 rounded-2xl shadow-xl overflow-hidden animate-fadeIn border border-slate-800">
                <div className="bg-black/40 p-4 flex items-center gap-3 shadow-md z-10 border-b border-white/5">
                    <div className="bg-amber-400 p-2 rounded-full">
                        <MessageCircle size={20} className="text-black" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">AI Бизнес Ментор</h3>
                        <p className="text-slate-400 text-xs">Винаги на линия за вашите въпроси</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/50">
                    {chatHistory.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            <Sparkles size={40} className="mx-auto mb-4 text-amber-400 opacity-50" />
                            <p>Задайте въпрос за вашия бизнес план...</p>
                            <p className="text-xs mt-2">Пример: "Как да намеря първите клиенти с 0 лева?"</p>
                        </div>
                    )}
                    {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div 
                                className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-amber-400 text-black rounded-br-none' 
                                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                                }`}
                            >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isChatLoading && (
                        <div className="flex justify-start">
                             <div className="bg-slate-800 p-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-700">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                             </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div className="p-4 bg-slate-900 border-t border-slate-800">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Напишете съобщение..." 
                            className="flex-1 p-3 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 bg-slate-950 text-white placeholder-slate-600"
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={isChatLoading || !chatInput.trim()}
                            className="bg-amber-400 text-black p-3 rounded-xl hover:bg-amber-500 transition-colors disabled:opacity-50"
                        >
                            <Send size={20} />
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
            <div className="w-16 h-16 border-4 border-slate-800 border-t-amber-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={24} className="text-amber-400 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-xl font-bold text-white">Генериране на стратегия...</p>
          <p className="text-sm text-slate-400 mt-1">Използване на AI модели за анализ</p>
        </div>
      );
    }

    // Interactive Roadmap Display
    if (activeSection === Section.RISKS && data[Section.RISKS]?.roadmap) {
        const { risks, roadmap } = data[Section.RISKS] as RisksAndRoadmapData;
        const progress = Math.round((roadmapTasks.filter(t => t.isCompleted).length / roadmapTasks.length) * 100) || 0;

        return (
            <div className="space-y-8 animate-fadeIn">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Roadmap & Рискове</h2>
                        <p className="text-slate-400">Вашият план за действие стъпка по стъпка.</p>
                    </div>
                    <div className="bg-slate-800 rounded-full px-4 py-1 text-sm font-bold text-slate-300 border border-slate-700">
                        Прогрес: <span className="text-amber-400">{progress}%</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-3 mb-8 overflow-hidden">
                    <div className="bg-amber-400 h-3 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Roadmap Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="font-bold text-white uppercase text-sm tracking-wider mb-2 flex items-center gap-2">
                            <CheckSquare size={18} className="text-emerald-400"/> Задачи
                        </h3>
                        {roadmapTasks.map((task) => (
                            <div 
                                key={task.id} 
                                onClick={() => toggleTask(task.id)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer group flex items-start gap-4 ${
                                    task.isCompleted 
                                    ? 'bg-emerald-900/10 border-emerald-900/30 opacity-60' 
                                    : 'bg-slate-900/60 border-slate-800 hover:border-amber-400/50 shadow-sm'
                                }`}
                            >
                                <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    task.isCompleted ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-slate-600 group-hover:border-amber-400'
                                }`}>
                                    {task.isCompleted && <CheckCircle size={14} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-black bg-amber-400 px-2 py-0.5 rounded">Седмица {task.week}</span>
                                        <h4 className={`font-bold text-slate-200 ${task.isCompleted ? 'line-through text-slate-500' : ''}`}>{task.title}</h4>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed">{task.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Risks Column */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-white uppercase text-sm tracking-wider mb-2 flex items-center gap-2">
                            <AlertTriangle size={18} className="text-rose-500"/> Рискове
                        </h3>
                        {risks.map((risk, idx) => (
                            <div key={idx} className="bg-rose-900/10 p-4 rounded-xl border border-rose-900/30">
                                <h4 className="font-bold text-rose-400 mb-2">{risk.title}</h4>
                                <p className="text-sm text-rose-200/70 italic">" {risk.mitigation} "</p>
                            </div>
                        ))}
                         <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 mt-8 text-center">
                            <p className="text-sm text-slate-400 mb-4">Имате въпроси по плана?</p>
                            <button 
                                onClick={() => {/* Needs redirect logic or user clicks sidebar */}}
                                className="text-amber-400 font-bold hover:text-amber-300 transition-colors flex items-center justify-center gap-2 mx-auto"
                            >
                                Попитайте Ментора <ArrowRight size={16}/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Standard Text Layout for other sections (Validation, Market, etc.)
    const sectionData = data[activeSection];
    if (!sectionData) {
      return (
        <div className="text-center py-24 bg-slate-900/60 rounded-2xl border border-dashed border-slate-700 shadow-sm mx-4 md:mx-0">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
             <RefreshCw size={32} className="text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Няма данни за тази секция</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">Натиснете бутона по-долу, за да стартирате специализиран AI анализ за вашия бизнес.</p>
          <button 
            onClick={() => fetchDataForSection(activeSection)}
            className="bg-amber-400 hover:bg-amber-500 text-black px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-amber-400/30 flex items-center gap-2 mx-auto hover:scale-105"
          >
            <RefreshCw size={20} />
            Генерирай Анализ
          </button>
        </div>
      );
    }

    // Special Layout for Finance (Charts)
    if (activeSection === Section.FINANCE) {
      const { analysis, data: chartData } = sectionData as { analysis: string, data: FinancialDataPoint[] };
      return (
        <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900/80 p-6 md:p-8 rounded-2xl shadow-lg border border-slate-800 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <DollarSign size={24} className="text-amber-500"/>
                        Финансова Прогноза (6 Месеца)
                    </h3>
                    <div className="flex gap-4 text-xs font-semibold text-slate-400">
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Приход</div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-slate-600"></span> Разход</div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400"></span> Печалба</div>
                    </div>
                </div>
                
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                            <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                            <Tooltip 
                                cursor={{fill: '#1e293b'}}
                                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)', color: '#fff' }}
                            />
                            <Bar dataKey="revenue" name="Приходи" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expenses" name="Разходи" fill="#475569" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="profit" name="Печалба" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-emerald-950/40 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden border border-emerald-900/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600 rounded-full blur-[100px] -mr-16 -mt-16 opacity-20"></div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10 text-amber-400">
                    <CheckCircle size={24}/>
                    AI Финансов Анализ
                </h3>
                <div className="prose prose-invert max-w-none relative z-10 text-slate-300">
                    {renderContent(analysis)}
                </div>
            </div>
        </div>
      );
    }

    // Default Fallback (Text Sections)
    return (
      <div className="bg-slate-900/60 p-8 md:p-10 rounded-2xl shadow-xl border border-slate-800 animate-fadeIn relative backdrop-blur-sm">
        <div className="flex justify-between items-start mb-8 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-800 text-amber-400 rounded-xl">
                    {activeSection === Section.IDEA_VALIDATION && <Lightbulb size={28} />}
                    {activeSection === Section.MARKET_ANALYSIS && <TrendingUp size={28} />}
                    {activeSection === Section.BUSINESS_PLAN && <FileText size={28} />}
                    {activeSection === Section.MARKETING && <Megaphone size={28} />}
                    {activeSection === Section.LEGAL && <Scale size={28} />}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">
                        {activeSection === Section.IDEA_VALIDATION && 'Валидация на Идея'}
                        {activeSection === Section.MARKET_ANALYSIS && 'Пазарен Анализ'}
                        {activeSection === Section.BUSINESS_PLAN && 'Бизнес План'}
                        {activeSection === Section.MARKETING && 'Маркетингова Стратегия'}
                        {activeSection === Section.LEGAL && 'Правни Изисквания'}
                    </h2>
                    <p className="text-slate-500 text-sm">Генерирано от Gemini 2.5 Flash (Ментор Режим)</p>
                </div>
            </div>
            
            <button 
                onClick={() => fetchDataForSection(activeSection)}
                className="text-slate-400 hover:text-amber-400 transition p-2 hover:bg-white/5 rounded-lg group"
                title="Регенерирай"
            >
                <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
        </div>
        <div className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-a:text-amber-400 text-slate-300">
          {renderContent(sectionData as string)}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-20">
      <header className="mb-8 md:flex items-center justify-between hidden">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
                Преглед на Проекта
            </h1>
            <p className="text-slate-400 mt-1">Управлявайте и развивайте вашия бизнес план</p>
          </div>
          <div className="h-12 w-12 bg-slate-800 rounded-full flex items-center justify-center text-amber-400 font-bold text-lg border-2 border-slate-700 shadow-sm">
             {userProfile.name.charAt(0)}
          </div>
      </header>
      {renderSection()}
    </div>
  );
};

export default Dashboard;