import React, { useState } from 'react';
import { TrendingUp, Scale, BarChart3, ChevronRight, Twitter, Facebook, Linkedin, Instagram, CheckCircle, Zap, Globe, Shield, ArrowRight } from 'lucide-react';
import InfoModal from './InfoModal';

interface LandingPageProps {
  onStart: () => void;
}

type ModalType = 'terms' | 'privacy' | 'cookies' | 'about' | 'careers' | 'contact' | 'pricing' | 'teams' | 'enterprise' | 'blog' | null;

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const modalContent: Record<Exclude<ModalType, null>, { title: string; content: React.ReactNode }> = {
    terms: {
      title: 'Terms of Service',
      content: (
        <div className="space-y-4">
          <p><strong>Last Updated:</strong> December 2024</p>
          <h3 className="text-lg font-bold text-amber-400">1. Acceptance of Terms</h3>
          <p>By accessing and using ApexBusiness, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          <h3 className="text-lg font-bold text-amber-400">2. Use License</h3>
          <p>Permission is granted to temporarily use ApexBusiness for personal, non-commercial transitory viewing only. This license does not include modifying or copying materials, using materials for commercial purposes, or attempting to reverse engineer any software.</p>
          <h3 className="text-lg font-bold text-amber-400">3. Disclaimer</h3>
          <p>The materials on ApexBusiness are provided on an 'as is' basis. ApexBusiness makes no warranties, expressed or implied, and hereby disclaims all warranties including merchantability and fitness for a particular purpose.</p>
          <h3 className="text-lg font-bold text-amber-400">4. Limitations</h3>
          <p>ApexBusiness shall not be held liable for any damages arising from the use or inability to use our materials.</p>
        </div>
      )
    },
    privacy: {
      title: 'Privacy Policy',
      content: (
        <div className="space-y-4">
          <p><strong>Last Updated:</strong> December 2024</p>
          <h3 className="text-lg font-bold text-amber-400">Information We Collect</h3>
          <p>We collect information you provide directly, such as your name, email, and business information when you create an account.</p>
          <h3 className="text-lg font-bold text-amber-400">How We Use Your Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and improve our AI business analysis services</li>
            <li>To personalize your experience</li>
            <li>To communicate with you about updates and features</li>
          </ul>
          <h3 className="text-lg font-bold text-amber-400">Data Security</h3>
          <p>Your data is encrypted using industry-standard protocols. We never sell your personal information to third parties.</p>
          <h3 className="text-lg font-bold text-amber-400">Your Rights</h3>
          <p>You can request access, correction, or deletion of your data at any time by contacting support@apexbusiness.ai</p>
        </div>
      )
    },
    cookies: {
      title: 'Cookie Policy',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-amber-400">What Are Cookies?</h3>
          <p>Cookies are small text files stored on your device that help us provide a better experience.</p>
          <h3 className="text-lg font-bold text-amber-400">Cookies We Use</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for the platform to function properly</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
            <li><strong>Preference Cookies:</strong> Remember your settings (like dark mode)</li>
          </ul>
          <h3 className="text-lg font-bold text-amber-400">Managing Cookies</h3>
          <p>You can control cookies through your browser settings. Disabling essential cookies may affect functionality.</p>
        </div>
      )
    },
    about: {
      title: 'About ApexBusiness',
      content: (
        <div className="space-y-4">
          <p className="text-xl text-amber-400 font-semibold">Empowering Entrepreneurs with AI</p>
          <p>Founded in 2024, ApexBusiness is an AI-powered business intelligence platform designed to transform how entrepreneurs launch and grow their ventures.</p>
          <h3 className="text-lg font-bold text-amber-400">Our Mission</h3>
          <p>To democratize business intelligence by making professional-grade market analysis, financial forecasting, and strategic planning accessible to everyone.</p>
          <h3 className="text-lg font-bold text-amber-400">What We Offer</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>AI-powered idea validation</li>
            <li>Comprehensive market analysis</li>
            <li>Financial forecasting and budgeting</li>
            <li>Legal compliance checking</li>
            <li>Marketing strategy generation</li>
            <li>Interactive roadmap planning</li>
          </ul>
          <h3 className="text-lg font-bold text-amber-400">Our Technology</h3>
          <p>Powered by Google's Gemini 2.5 Flash, our AI provides real-time analysis and personalized recommendations for your business.</p>
        </div>
      )
    },
    careers: {
      title: 'Careers at ApexBusiness',
      content: (
        <div className="space-y-4">
          <p className="text-xl text-amber-400 font-semibold">Join Our Team!</p>
          <p>We're always looking for talented individuals passionate about AI and entrepreneurship.</p>
          <h3 className="text-lg font-bold text-amber-400">Open Positions</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Full-Stack Developer</strong> - React, Node.js, TypeScript</li>
            <li><strong>AI/ML Engineer</strong> - LLM integration, prompt engineering</li>
            <li><strong>UX Designer</strong> - Creating beautiful, intuitive interfaces</li>
            <li><strong>Business Analyst</strong> - Market research, product strategy</li>
          </ul>
          <h3 className="text-lg font-bold text-amber-400">How to Apply</h3>
          <p>Send your resume and portfolio to: <span className="text-amber-400">careers@apexbusiness.ai</span></p>
        </div>
      )
    },
    contact: {
      title: 'Contact Us',
      content: (
        <div className="space-y-4">
          <p className="text-xl text-amber-400 font-semibold">We'd Love to Hear From You!</p>
          <h3 className="text-lg font-bold text-amber-400">General Inquiries</h3>
          <p>Email: <span className="text-amber-400">hello@apexbusiness.ai</span></p>
          <h3 className="text-lg font-bold text-amber-400">Technical Support</h3>
          <p>Email: <span className="text-amber-400">support@apexbusiness.ai</span></p>
          <h3 className="text-lg font-bold text-amber-400">Business & Partnerships</h3>
          <p>Email: <span className="text-amber-400">partners@apexbusiness.ai</span></p>
          <h3 className="text-lg font-bold text-amber-400">Office</h3>
          <p>Sofia, Bulgaria 🇧🇬</p>
          <p className="text-sm text-slate-500 mt-4">Response time: Within 24 hours</p>
        </div>
      )
    },
    pricing: {
      title: 'Pricing Plans',
      content: (
        <div className="space-y-4">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6">
            <p className="text-emerald-400 font-bold text-lg">🎉 Currently FREE during Beta!</p>
            <p className="text-slate-400 text-sm">Get full access to all features while we're in beta.</p>
          </div>
          <h3 className="text-lg font-bold text-amber-400">Coming Soon: Premium Plans</h3>
          <div className="grid gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-white/10">
              <p className="font-bold text-white">Starter - $19/mo</p>
              <p className="text-sm text-slate-400">Basic AI analysis, 5 reports/month</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-amber-400/30">
              <p className="font-bold text-amber-400">Pro - $49/mo</p>
              <p className="text-sm text-slate-400">Unlimited reports, priority AI, export to PDF</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-white/10">
              <p className="font-bold text-white">Enterprise - Custom</p>
              <p className="text-sm text-slate-400">Team features, API access, dedicated support</p>
            </div>
          </div>
        </div>
      )
    },
    teams: {
      title: 'ApexBusiness for Teams',
      content: (
        <div className="space-y-4">
          <p className="text-xl text-amber-400 font-semibold">Empower Your Entire Team</p>
          <p>Coming soon: Collaborative features for startups and small businesses.</p>
          <h3 className="text-lg font-bold text-amber-400">Team Features</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Shared workspace for all team members</li>
            <li>Collaborative business plan editing</li>
            <li>Role-based access controls</li>
            <li>Team analytics and insights</li>
            <li>Centralized billing</li>
          </ul>
          <h3 className="text-lg font-bold text-amber-400">Early Access</h3>
          <p>Want early access to team features? Contact us at <span className="text-amber-400">teams@apexbusiness.ai</span></p>
        </div>
      )
    },
    enterprise: {
      title: 'Enterprise Solutions',
      content: (
        <div className="space-y-4">
          <p className="text-xl text-amber-400 font-semibold">Built for Scale</p>
          <p>Custom AI solutions for larger organizations and accelerators.</p>
          <h3 className="text-lg font-bold text-amber-400">Enterprise Features</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Custom AI model training on your data</li>
            <li>White-label solutions</li>
            <li>API access for integration</li>
            <li>Dedicated account manager</li>
            <li>SLA guarantees</li>
            <li>On-premise deployment options</li>
          </ul>
          <h3 className="text-lg font-bold text-amber-400">Contact Sales</h3>
          <p>Email: <span className="text-amber-400">enterprise@apexbusiness.ai</span></p>
        </div>
      )
    },
    blog: {
      title: 'ApexBusiness Blog',
      content: (
        <div className="space-y-4">
          <p className="text-xl text-amber-400 font-semibold">Coming Soon!</p>
          <p>Our blog will feature:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>AI-powered business insights</li>
            <li>Startup success stories</li>
            <li>Market trend analysis</li>
            <li>Tips for entrepreneurs</li>
            <li>Product updates and tutorials</li>
          </ul>
          <h3 className="text-lg font-bold text-amber-400">Stay Updated</h3>
          <p>Subscribe to our newsletter to be notified when we launch the blog!</p>
        </div>
      )
    }
  };

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
      <footer className="bg-black text-slate-500 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="text-xl font-bold text-white mb-2">
              Apex<span className="text-amber-400">Business</span>
            </div>
            <p className="text-xs leading-relaxed mb-4">
              Your intelligent partner for business success.
            </p>
            <div className="flex gap-3 text-slate-400">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition"><Twitter size={20} /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition"><Facebook size={20} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition"><Linkedin size={20} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-white font-bold mb-2 uppercase text-xs tracking-wider">Product</h4>
            <ul className="space-y-1 text-xs">
              <li><button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-amber-400 transition text-left">Features</button></li>
              <li><button onClick={() => setActiveModal('pricing')} className="hover:text-amber-400 transition text-left">Pricing</button></li>
              <li><button onClick={() => setActiveModal('teams')} className="hover:text-amber-400 transition text-left">For Teams</button></li>
              <li><button onClick={() => setActiveModal('enterprise')} className="hover:text-amber-400 transition text-left">Enterprise</button></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-white font-bold mb-2 uppercase text-xs tracking-wider">Company</h4>
            <ul className="space-y-1 text-xs">
              <li><button onClick={() => setActiveModal('about')} className="hover:text-amber-400 transition text-left">About Us</button></li>
              <li><button onClick={() => setActiveModal('careers')} className="hover:text-amber-400 transition text-left">Careers</button></li>
              <li><button onClick={() => setActiveModal('contact')} className="hover:text-amber-400 transition text-left">Contacts</button></li>
              <li><button onClick={() => setActiveModal('blog')} className="hover:text-amber-400 transition text-left">Blog</button></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div>
            <h4 className="text-white font-bold mb-2 uppercase text-xs tracking-wider">Legal</h4>
            <ul className="space-y-1 text-xs">
              <li><button onClick={() => setActiveModal('terms')} className="hover:text-amber-400 transition text-left">Terms of Service</button></li>
              <li><button onClick={() => setActiveModal('privacy')} className="hover:text-amber-400 transition text-left">Privacy Policy</button></li>
              <li><button onClick={() => setActiveModal('cookies')} className="hover:text-amber-400 transition text-left">Cookies</button></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-6 pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; 2026 ApexBusiness Inc. All rights reserved.</p>
          <p className="mt-1 md:mt-0">Made with ❤️ in Bulgaria</p>
        </div>
      </footer>

      {/* Modals */}
      {activeModal && (
        <InfoModal
          title={modalContent[activeModal].title}
          onClose={() => setActiveModal(null)}
        >
          {modalContent[activeModal].content}
        </InfoModal>
      )}
    </div>
  );
};

export default LandingPage;