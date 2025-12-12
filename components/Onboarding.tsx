import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Rocket, Mail, User, ChevronRight, ChevronLeft, Users, Lock, DollarSign } from 'lucide-react';

interface OnboardingProps {
    onComplete: (profile: UserProfile) => void;
    onBack: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onBack }) => {
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
    const [step, setStep] = useState(1);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<UserProfile>({
        name: '',
        email: '',
        businessIdea: '',
        capital: 0,
        experience: 'Начинаещ',
        location: 'България',
        teamSize: 1,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'capital' || name === 'teamSize') ? Number(value) : value
        }));
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => setStep(prev => prev - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { api } = await import('../services/api');

            if (authMode === 'login') {
                const data = await api.login({ email: formData.email, password });
                api.setToken(data.token);
                const profile = await api.getProfile();
                onComplete(profile || { ...formData, name: data.user.name });
            } else {
                // Register
                const data = await api.register({
                    name: formData.name,
                    email: formData.email,
                    password
                });
                api.setToken(data.token);

                // Save Profile
                await api.updateProfile(formData);

                onComplete(formData);
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

                    {/* Left Panel - Visuals */}
                    <div className="bg-black/50 p-10 text-white md:w-5/12 relative overflow-hidden flex flex-col justify-between border-r border-white/5">
                        {/* Decorative Gold Circles */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-emerald-800/20 blur-2xl"></div>

                        <div className="relative z-10">
                            <button onClick={onBack} className="text-slate-400 hover:text-white text-sm font-bold mb-8 flex items-center gap-1 transition-colors">
                                <ChevronLeft size={16} /> Начало
                            </button>
                            <div className="bg-gradient-to-br from-amber-400 to-amber-600 w-16 h-16 rounded-2xl rotate-3 flex items-center justify-center mb-6 shadow-2xl shadow-amber-500/20">
                                <Rocket size={32} className="text-black -rotate-3" />
                            </div>
                            <h2 className="text-4xl font-bold mb-2 tracking-tight">Biz<span className="text-amber-400">AI</span></h2>
                            <p className="text-slate-400 text-lg">Вход към вашето бъдеще.</p>
                        </div>

                        <div className="relative z-10 mt-12 md:mt-0">
                            <div className="p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 mb-4">
                                <p className="text-sm italic text-slate-300">"Най-добрият начин да предвидиш бъдещето е да го създадеш."</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Form */}
                    <div className="p-10 md:w-7/12 bg-slate-900 overflow-y-auto">
                        {/* Auth Toggle */}
                        <div className="flex gap-6 border-b border-slate-700 mb-8">
                            <button
                                type="button"
                                onClick={() => { setAuthMode('login'); setStep(1); setError(''); }}
                                className={`pb-2 text-lg font-bold transition-colors ${authMode === 'login' ? 'text-white border-b-2 border-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Вход
                            </button>
                            <button
                                type="button"
                                onClick={() => { setAuthMode('signup'); setStep(1); setError(''); }}
                                className={`pb-2 text-lg font-bold transition-colors ${authMode === 'signup' ? 'text-white border-b-2 border-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Регистрация
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="h-full">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-4 text-sm">
                                    {error}
                                </div>
                            )}

                            {authMode === 'login' ? (
                                <div className="space-y-6 animate-fadeIn">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2">Имейл</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-3.5 text-slate-500" size={20} />
                                            <input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="name@company.com"
                                                className="w-full pl-12 pr-4 py-3 border border-slate-700 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 outline-none bg-slate-950 text-white placeholder-slate-600"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2">Парола</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-3.5 text-slate-500" size={20} />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full pl-12 pr-4 py-3 border border-slate-700 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 outline-none bg-slate-950 text-white placeholder-slate-600"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-amber-400 text-black py-4 rounded-xl font-bold hover:bg-amber-500 transition shadow-xl mt-4 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Зареждане...' : 'Влез'}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {step === 1 && (
                                        <div className="space-y-6 animate-fadeIn">
                                            <h3 className="text-xl font-bold text-white">Лична Информация</h3>

                                            <div>
                                                <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Вашето Име</label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-amber-400 transition-colors" size={20} />
                                                    <input
                                                        required
                                                        name="name"
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className="w-full pl-12 pr-4 py-3 border border-slate-700 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none transition-all text-white font-medium bg-slate-950 placeholder-slate-600"
                                                        placeholder="Иван Иванов"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Имейл Адрес</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-amber-400 transition-colors" size={20} />
                                                    <input
                                                        required
                                                        name="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="w-full pl-12 pr-4 py-3 border border-slate-700 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none transition-all text-white font-medium bg-slate-950 placeholder-slate-600"
                                                        placeholder="ivan@example.com"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Парола</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-amber-400 transition-colors" size={20} />
                                                    <input
                                                        type="password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-3 border border-slate-700 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none transition-all text-white font-medium bg-slate-950 placeholder-slate-600"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-4">
                                                <button
                                                    type="button"
                                                    onClick={handleNext}
                                                    className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 hover:gap-3"
                                                >
                                                    Напред <ChevronRight size={20} className="text-amber-400" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="space-y-6 animate-fadeIn">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">За Бизнеса</h3>
                                                <p className="text-xs text-slate-500">Колкото по-детайлно, толкова по-точен анализ.</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Опишете идеята си (Детайлно)</label>
                                                <textarea
                                                    required
                                                    name="businessIdea"
                                                    value={formData.businessIdea}
                                                    onChange={handleChange}
                                                    rows={4}
                                                    className="w-full p-4 border border-slate-700 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none transition-all text-white font-medium resize-none text-sm bg-slate-950 placeholder-slate-600"
                                                    placeholder="Моля, опишете продукта/услугата, целевата група, и как планирате да печелите..."
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Капитал (BGN)</label>
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-3 top-3 text-amber-500" size={16} />
                                                        <input
                                                            required
                                                            name="capital"
                                                            type="number"
                                                            min="0"
                                                            value={formData.capital}
                                                            onChange={handleChange}
                                                            className="w-full pl-9 pr-3 py-2.5 border border-slate-700 rounded-xl focus:border-amber-400 outline-none text-sm bg-slate-950 text-white"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Екип (брой)</label>
                                                    <div className="relative">
                                                        <Users className="absolute left-3 top-3 text-slate-500" size={16} />
                                                        <input
                                                            required
                                                            name="teamSize"
                                                            type="number"
                                                            min="1"
                                                            value={formData.teamSize}
                                                            onChange={handleChange}
                                                            className="w-full pl-9 pr-3 py-2.5 border border-slate-700 rounded-xl focus:border-amber-400 outline-none text-sm bg-slate-950 text-white"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Локация</label>
                                                    <input
                                                        required
                                                        name="location"
                                                        type="text"
                                                        value={formData.location}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2.5 border border-slate-700 rounded-xl focus:border-amber-400 outline-none text-sm bg-slate-950 text-white"
                                                        placeholder="София"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Опит</label>
                                                    <select
                                                        name="experience"
                                                        value={formData.experience}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2.5 border border-slate-700 rounded-xl focus:border-amber-400 outline-none text-sm bg-slate-950 text-white"
                                                    >
                                                        <option value="Начинаещ">Начинаещ</option>
                                                        <option value="Средно ниво">Средно ниво</option>
                                                        <option value="Експерт">Експерт</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-4">
                                                <button
                                                    type="button"
                                                    onClick={handlePrev}
                                                    className="text-slate-400 hover:text-white font-bold px-4 py-2 flex items-center gap-1 transition-colors text-sm"
                                                >
                                                    <ChevronLeft size={16} /> Назад
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="bg-amber-400 hover:bg-amber-500 text-black px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 hover:scale-105 shadow-xl shadow-amber-400/20 text-sm"
                                                >
                                                    Създай Акаунт
                                                    <Rocket size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            <footer className="py-6 text-center text-slate-500 text-sm">
                <p>&copy; 2024 ApexBusiness. Всички права запазени. | <a href="#" className="hover:text-amber-400">Условия</a> | <a href="#" className="hover:text-amber-400">Поверителност</a></p>
            </footer>
        </div>
    );
};

export default Onboarding;