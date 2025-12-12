import React from 'react';
import { TrendingUp, Scale, BarChart3, ChevronRight, Twitter, Facebook, Linkedin, Instagram, CheckCircle, Zap, Globe, Shield, ArrowRight } from 'lucide-react';

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
            Login
          </button>
          <button
            onClick={onStart}
            className="bg-amber-400 hover:bg-amber-500 text-black px-5 py-2 rounded-lg font-bold transition-all shadow-lg shadow-amber-400/20"
          >
            Start Now
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
            ✨ Next Generation AI Business Assistant
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Turn your ideas into a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
              Golden Empire
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            ApexBusiness is your strategic partner transforming abstract ideas into actionable business empires. Through deep market analysis, precise financial modeling, and personalized strategies, our AI gives you the competitive edge needed for success in a dynamic economy.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="w-full md:w-auto bg-amber-400 hover:bg-amber-500 text-black text-lg px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 hover:scale-105 shadow-xl shadow-amber-400/20"
            >
              Create Account <ChevronRight size={20} />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full md:w-auto px-8 py-4 rounded-xl font-bold text-white border border-white/20 hover:bg-white/5 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="max-w-7xl mx-auto px-6 py-24 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/10 hover:border-amber-400/30 transition-all duration-300">
            <div className="w-14 h-14 bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20">
              <TrendingUp size={28} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Market Analysis</h3>
            <p className="text-slate-400 leading-relaxed">
              Deep research of competition and trends in your niche to always stay one step ahead.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/10 hover:border-amber-400/30 transition-all duration-300 border-t-4 border-t-amber-400">
            <div className="w-14 h-14 bg-amber-900/30 rounded-xl flex items-center justify-center mb-6 border border-amber-500/20">
              <BarChart3 size={28} className="text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Financial Forecasts</h3>
            <p className="text-slate-400 leading-relaxed">
              Generating detailed budgets, revenue and expense forecasts for the first 6 months of launch.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/10 hover:border-amber-400/30 transition-all duration-300">
            <div className="w-14 h-14 bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20">
              <Scale size={28} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Legal Advice</h3>
            <p className="text-slate-400 leading-relaxed">
              Checking regulatory requirements, licenses, and necessary documents for your location.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-slate-900/40 py-24 px-6 relative border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">How It Works?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Just three steps separate you from a professional business plan and development strategy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="relative group">
              <div className="text-9xl font-bold text-white/5 absolute -top-10 -left-6 select-none group-hover:text-amber-500/10 transition-colors">01</div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-amber-400/50 transition-colors shadow-lg">
                  <Zap className="text-amber-400" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Enter Idea</h3>
                <p className="text-slate-400 leading-relaxed">
                  Briefly describe your business concept. Our AI will ask clarifying questions to understand your vision in depth.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="text-9xl font-bold text-white/5 absolute -top-10 -left-6 select-none group-hover:text-emerald-500/10 transition-colors">02</div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-emerald-400/50 transition-colors shadow-lg">
                  <CheckCircle className="text-emerald-400" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI Analysis</h3>
                <p className="text-slate-400 leading-relaxed">
                  Algorithms process millions of data points to generate market analysis, competitor profile, and financial forecasts.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="text-9xl font-bold text-white/5 absolute -top-10 -left-6 select-none group-hover:text-indigo-500/10 transition-colors">03</div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-indigo-400/50 transition-colors shadow-lg">
                  <ArrowRight className="text-indigo-400" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Take Action</h3>
                <p className="text-slate-400 leading-relaxed">
                  Receive an investor-ready business plan, PDF export, and interactive Roadmap for goal execution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust/Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
          <div className="text-4xl font-bold text-white mb-2">500+</div>
          <div className="text-slate-400 text-sm uppercase tracking-wider">Businesses Launched</div>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
          <div className="text-4xl font-bold text-emerald-400 mb-2">98%</div>
          <div className="text-slate-400 text-sm uppercase tracking-wider">Success Rate</div>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
          <div className="text-4xl font-bold text-amber-400 mb-2">24/7</div>
          <div className="text-slate-400 text-sm uppercase tracking-wider">AI Mentor</div>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
          <div className="text-4xl font-bold text-indigo-400 mb-2">10M+</div>
          <div className="text-slate-400 text-sm uppercase tracking-wider">Data Points Analyzed</div>
        </div>
      </div>

      {/* CTA Strip */}
      <div className="bg-white/5 border-y border-white/10 py-16 px-6 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to launch?</h2>
          <p className="text-slate-400 mb-8">
            Join hundreds of entrepreneurs using ApexBusiness to validate and develop their ideas.
          </p>
          <button
            onClick={onStart}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-xl shadow-emerald-900/20"
          >
            Enter the System
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-slate-500 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="text-2xl font-bold text-white mb-4">
              Apex<span className="text-amber-400">Business</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Your intelligent partner for business success. From idea to realization.
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
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition">Features</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Pricing</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">For Teams</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Enterprise</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Careers</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Contacts</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Blog</a></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2024 ApexBusiness Inc. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with ❤️ in Bulgaria</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;