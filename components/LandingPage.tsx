import React from 'react';
import { TrendingUp, Scale, BarChart3, ChevronRight, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen font-sans flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 bg-transparent border-b border-white/5">
        <div className="text-2xl font-bold text-white">
          ApexBusiness<span className="text-amber-400"><br></br>Intelligence</span>
        </div>
        <div>
          <button
            onClick={onStart}
            className="text-sm font-bold text-slate-300 hover:text-amber-400 transition mr-6 hidden md:inline-block"
          >
            Вход
          </button>
          <button
            onClick={onStart}
            className="bg-amber-400 hover:bg-amber-500 text-black px-5 py-2 rounded-lg font-bold transition-all shadow-lg shadow-amber-400/20"
          >
            Започни Сега
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative text-white overflow-hidden pt-16 pb-32 px-6 flex-grow">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] -ml-20 -mb-20"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 text-sm font-semibold mb-6 animate-fadeIn">
            ✨ AI Бизнес Асистент от ново поколение
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Превърнете идеите си в <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
              Златна Империя
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            ApexBusiness анализира пазара, създава финансови прогнози и изготвя детайлни бизнес планове за секунди, използвайки силата на изкуствения интелект.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="w-full md:w-auto bg-amber-400 hover:bg-amber-500 text-black text-lg px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 hover:scale-105 shadow-xl shadow-amber-400/20"
            >
              Създай Акаунт <ChevronRight size={20} />
            </button>
            <button className="w-full md:w-auto px-8 py-4 rounded-xl font-bold text-white border border-white/20 hover:bg-white/5 transition-colors">
              Научи повече
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/10 hover:border-amber-400/30 transition-all duration-300">
            <div className="w-14 h-14 bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20">
              <TrendingUp size={28} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Пазарен Анализ</h3>
            <p className="text-slate-400 leading-relaxed">
              Дълбоко проучване на конкуренцията и тенденциите във вашата ниша, за да сте винаги една крачка напред.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/10 hover:border-amber-400/30 transition-all duration-300 border-t-4 border-t-amber-400">
            <div className="w-14 h-14 bg-amber-900/30 rounded-xl flex items-center justify-center mb-6 border border-amber-500/20">
              <BarChart3 size={28} className="text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Финансови Прогнози</h3>
            <p className="text-slate-400 leading-relaxed">
              Генериране на детайлни бюджети, прогнози за приходи и разходи за първите 6 месеца от старта.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/10 hover:border-amber-400/30 transition-all duration-300">
            <div className="w-14 h-14 bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20">
              <Scale size={28} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Правни Съвети</h3>
            <p className="text-slate-400 leading-relaxed">
              Проверка на регулаторните изисквания, лицензи и необходими документи за вашата локация.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Strip */}
      <div className="bg-white/5 border-y border-white/10 py-16 px-6 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Готови ли сте да стартирате?</h2>
          <p className="text-slate-400 mb-8">
            Присъединете се към стотици предприемачи, които използват ApexBusiness за да валидират и развият своите идеи.
          </p>
          <button
            onClick={onStart}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-xl shadow-emerald-900/20"
          >
            Влезте в Системата
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-slate-500 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="text-2xl font-bold text-white mb-4">
              Biz<span className="text-amber-400">AI</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Вашият интелигентен партньор за бизнес успех. От идеята до реализацията.
            </p>
            <div className="flex gap-4 text-slate-400">
              <a href="#" className="hover:text-amber-400 transition"><Twitter size={20} /></a>
              <a href="#" className="hover:text-amber-400 transition"><Facebook size={20} /></a>
              <a href="#" className="hover:text-amber-400 transition"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-amber-400 transition"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Продукт</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition">Възможности</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Цени</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">За Екипи</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Enterprise</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Компания</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition">За Нас</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Кариери</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Контакти</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Блог</a></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Правни</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition">Условия за ползване</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Политика за поверителност</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Бисквитки</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2024 ApexBusiness Inc. Всички права запазени.</p>
          <p className="mt-2 md:mt-0">Създадено с ❤️ в България</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;