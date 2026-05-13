import React, { useState, useEffect } from 'react';
import { ChevronDown, Zap, Trophy, TrendingUp, Users, Target, Flame, Star, ArrowRight, Crown, Sparkles } from 'lucide-react';

const AnimatedCounter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(end * progress));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

const GamificationPreview = () => {
  const [selectedBadge, setSelectedBadge] = useState(0);

  const badges = [
    { name: 'Bronze', color: 'from-amber-700 to-amber-600', points: '0-500', icon: '🥉' },
    { name: 'Silver', color: 'from-slate-400 to-slate-300', points: '500-1500', icon: '🥈' },
    { name: 'Gold', color: 'from-yellow-400 to-yellow-300', points: '1500-3000', icon: '🥇' },
    { name: 'Platinum', color: 'from-cyan-300 to-blue-300', points: '3000-7500', icon: '💎' },
    { name: 'Legendary', color: 'from-yellow-300 to-yellow-200', points: '7500+', icon: '👑' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-5 gap-4">
        {badges.map((badge, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedBadge(idx)}
            className={`p-4 rounded-xl transition-all transform border-2 ${
              selectedBadge === idx
                ? `bg-gradient-to-br ${badge.color} scale-110 shadow-2xl border-yellow-300 shadow-yellow-500/50`
                : 'bg-gray-900 hover:bg-gray-800 scale-100 border-gray-700 hover:border-yellow-400'
            }`}
          >
            <div className="text-3xl mb-2">{badge.icon}</div>
            <div className="text-xs font-bold text-yellow-300">{badge.name}</div>
          </button>
        ))}
      </div>

      <div className={`bg-gradient-to-br ${badges[selectedBadge].color} rounded-2xl p-8 text-black shadow-2xl border-2 border-yellow-300 shadow-yellow-500/50`}>
        <h3 className="text-3xl font-black mb-2 font-orbitron">{badges[selectedBadge].name} Badge</h3>
        <p className="text-lg mb-6 font-bold">{badges[selectedBadge].points} Points</p>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star size={18} fill="black" />
            <span className="font-bold">Unlock exclusive community features</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy size={18} fill="black" />
            <span className="font-bold">Compete on leaderboards</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame size={18} fill="black" />
            <span className="font-bold">Earn streak bonuses</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeaderboardPreview = () => {
  const founders = [
    { rank: 1, name: 'AlphaWolf', mrr: '$12,870', badge: '👑', trend: '↑' },
    { rank: 2, name: 'LadyFlare', mrr: '$9,640', badge: '💎', trend: '↑' },
    { rank: 3, name: 'BigRyno', mrr: '$8,950', badge: '🥇', trend: '→' },
    { rank: 4, name: 'SilentBuilder', mrr: '$7,320', badge: '🥈', trend: '↓' },
    { rank: 5, name: 'NovaStrike', mrr: '$6,850', badge: '🥉', trend: '↑' },
  ];

  return (
    <div className="space-y-3">
      {founders.map((founder, idx) => (
        <div
          key={idx}
          className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border-2 border-yellow-500/30 hover:border-yellow-400 transition-all hover:bg-gray-800 hover:shadow-lg hover:shadow-yellow-500/20"
        >
          <div className="text-2xl font-black text-yellow-400 w-8 font-orbitron">{founder.rank}</div>
          <div className="text-2xl">{founder.badge}</div>
          <div className="flex-1">
            <div className="font-black text-yellow-300 font-rajdhani">{founder.name}</div>
            <div className="text-sm text-yellow-200">{founder.mrr} MRR</div>
          </div>
          <div className={`text-xl font-bold ${founder.trend === '↑' ? 'text-green-400' : founder.trend === '↓' ? 'text-red-400' : 'text-yellow-300'}`}>
            {founder.trend}
          </div>
        </div>
      ))}
    </div>
  );
};

export function EthinxBrandedLanding() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Animated Background - Metallic Gold Accents */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b-2 border-yellow-500">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* ETHINX Wordmark Logo - Pure Black Background, No Padding Distortion */}
          <a href="#" className="flex items-center h-16 bg-black">
            <img 
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663310720290/cYompxaoZjxqIyhY.png"
              alt="ETHINX Wordmark"
              className="h-12 w-auto object-contain"
              style={{ aspectRatio: '1.5 / 1' }}
            />
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-yellow-200 hover:text-yellow-400 transition font-bold font-rajdhani">Features</a>
            <a href="#gamification" className="text-yellow-200 hover:text-yellow-400 transition font-bold font-rajdhani">Gamification</a>
            <a href="#testimonials" className="text-yellow-200 hover:text-yellow-400 transition font-bold font-rajdhani">Success</a>
            <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-black py-2 px-6 rounded-lg transition-all shadow-lg shadow-yellow-500/50 font-orbitron">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-yellow-500/20 border-2 border-yellow-500 rounded-full">
                  <span className="text-yellow-300 text-sm font-black font-rajdhani">🚀 JOIN 500+ STREET-SMART FOUNDERS</span>
                </div>

                <h1 className="text-7xl lg:text-8xl font-black leading-tight text-yellow-400 font-orbitron tracking-tight">
                  BUILD
                  <br />
                  <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                    $100K MRR
                  </span>
                  <br />
                  IN 4 WEEKS
                </h1>

                <p className="text-xl text-yellow-100 leading-relaxed max-w-lg font-rajdhani font-bold">
                  I might be tech dumb, but I'm street savvy. PromptForge gives you AI-powered prompts, gamification, and a community to build profitable digital businesses—fast.
                </p>
              </div>

              <div className="space-y-4">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-6 py-4 rounded-lg bg-gray-900 border-2 border-yellow-500 focus:border-yellow-300 focus:outline-none text-yellow-100 placeholder-yellow-600 font-bold font-rajdhani transition-all"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 px-8 rounded-lg transition-all shadow-lg shadow-yellow-500/50 whitespace-nowrap font-orbitron"
                  >
                    {submitted ? '✓ SENT!' : 'START FREE'}
                  </button>
                </form>

                <div className="flex flex-wrap gap-6 text-sm text-yellow-300 font-bold font-rajdhani">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-yellow-400" />
                    <span>No credit card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-yellow-400" />
                    <span>500+ using</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-yellow-400" />
                    <span>78% success</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="relative h-96 lg:h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-3xl blur-3xl opacity-20 animate-pulse" />
              <div className="relative bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-3xl border-2 border-yellow-500 p-8 backdrop-blur-sm h-full flex items-center justify-center shadow-2xl shadow-yellow-500/30">
                <div className="text-center">
                  <div className="text-8xl mb-4 animate-bounce">🐕</div>
                  <h2 className="text-3xl font-black text-yellow-300 font-orbitron">T-DOG</h2>
                  <p className="text-yellow-200 mt-2 font-bold font-rajdhani">Your Street-Smart Companion</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown size={28} className="text-yellow-400" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-yellow-500/10 to-yellow-400/10 border-y-2 border-yellow-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-black text-yellow-400 mb-2 font-orbitron">
                <AnimatedCounter end={500} />+
              </div>
              <div className="text-yellow-300 font-black font-rajdhani">FOUNDERS</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-yellow-400 mb-2 font-orbitron">
                $<AnimatedCounter end={50} />K
              </div>
              <div className="text-yellow-300 font-black font-rajdhani">AVG MRR</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-yellow-400 mb-2 font-orbitron">4</div>
              <div className="text-yellow-300 font-black font-rajdhani">WEEKS TO LAUNCH</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-yellow-400 mb-2 font-orbitron">
                <AnimatedCounter end={78} />%
              </div>
              <div className="text-yellow-300 font-black font-rajdhani">SUCCESS RATE</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-4 text-yellow-400 font-orbitron tracking-tight">
              HOW PROMPTFORGE WORKS
            </h2>
            <p className="text-xl text-yellow-200 font-bold font-rajdhani">From zero to $100K MRR in 4 weeks</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Target, title: 'Answer 5 Questions', desc: 'Tell us your goal, niche, timeline, and budget' },
              { icon: Zap, title: 'Get 48 AI Prompts', desc: 'Revenue-optimized prompts for your business' },
              { icon: TrendingUp, title: 'Build & Scale', desc: 'Execute roadmap, track revenue, unlock achievements' },
              { icon: Trophy, title: 'Gamification', desc: 'Earn points, unlock badges, climb leaderboards' },
              { icon: Users, title: 'Community', desc: 'Join 500+ street-smart founders' },
              { icon: Flame, title: 'Revenue Predictor', desc: 'Real-time dashboard with live metrics' },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border-2 border-yellow-500/50 hover:border-yellow-400 transition-all hover:shadow-2xl hover:shadow-yellow-500/30 hover:-translate-y-2"
              >
                <feature.icon size={32} className="text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-black mb-3 text-yellow-300 font-rajdhani">{feature.title}</h3>
                <p className="text-yellow-100 font-bold font-rajdhani">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section id="gamification" className="py-32 px-6 bg-gradient-to-b from-gray-900 to-black border-y-2 border-yellow-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Badge System */}
            <div>
              <h2 className="text-4xl font-black mb-8 text-yellow-400 font-orbitron tracking-tight">
                MEET T-DOG
              </h2>
              <GamificationPreview />
            </div>

            {/* Right: Leaderboard */}
            <div>
              <h3 className="text-2xl font-black mb-6 text-yellow-300 font-orbitron">LIVE LEADERBOARD</h3>
              <LeaderboardPreview />
              <button className="mt-8 w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 px-6 rounded-lg transition-all shadow-lg shadow-yellow-500/50 font-orbitron">
                VIEW FULL LEADERBOARD
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16 text-yellow-400 font-orbitron tracking-tight">
            FOUNDER SUCCESS STORIES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Chen', mrr: '$50K', time: '4 weeks', quote: 'PromptForge gave me the exact roadmap I needed.' },
              { name: 'Marcus Johnson', mrr: '$25K', time: '3 weeks', quote: 'I\'m not technical, but I\'m street-smart. PromptForge speaks my language.' },
              { name: 'Jennifer Lee', mrr: '$75K', time: '5 weeks', quote: 'The gamification system kept me motivated to push harder.' },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border-2 border-yellow-500/50 hover:border-yellow-400 transition-all hover:shadow-2xl hover:shadow-yellow-500/20"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-yellow-100 mb-6 italic font-bold font-rajdhani">"{testimonial.quote}"</p>
                <div className="border-t-2 border-yellow-500 pt-4">
                  <h3 className="font-black text-yellow-300 font-rajdhani">{testimonial.name}</h3>
                  <p className="text-sm text-yellow-400 font-bold">
                    {testimonial.mrr} MRR in {testimonial.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section - $2,500 Offer */}
      <section className="py-32 px-6 bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 border-y-2 border-yellow-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-6 text-yellow-400 font-orbitron tracking-tight">
            READY TO BUILD YOUR
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              $100K EMPIRE?
            </span>
          </h2>
          <p className="text-xl text-yellow-100 mb-10 font-bold font-rajdhani">
            Join 500+ street-smart founders building profitable digital businesses with PromptForge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 px-8 rounded-lg transition-all shadow-lg shadow-yellow-500/50 inline-flex items-center justify-center gap-2 font-orbitron">
              START FREE <ArrowRight size={20} />
            </button>
            <button className="bg-transparent border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 font-black py-4 px-8 rounded-lg transition-all font-orbitron">
              $2,500 PREMIUM PACKAGE
            </button>
          </div>
          <div className="mt-8 p-6 bg-black/50 border-2 border-yellow-500 rounded-xl">
            <Sparkles className="inline text-yellow-400 mb-2" size={24} />
            <p className="text-yellow-300 font-black font-rajdhani">
              Premium Package includes: Full dashboard access, Priority support, Custom prompts, Community badge
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t-2 border-yellow-500 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-black mb-4 text-yellow-400 font-orbitron">PRODUCT</h3>
              <ul className="space-y-2 text-yellow-200 text-sm font-bold font-rajdhani">
                <li><a href="#" className="hover:text-yellow-400 transition">Features</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-black mb-4 text-yellow-400 font-orbitron">COMMUNITY</h3>
              <ul className="space-y-2 text-yellow-200 text-sm font-bold font-rajdhani">
                <li><a href="#" className="hover:text-yellow-400 transition">Leaderboard</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition">Discord</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-black mb-4 text-yellow-400 font-orbitron">COMPANY</h3>
              <ul className="space-y-2 text-yellow-200 text-sm font-bold font-rajdhani">
                <li><a href="#" className="hover:text-yellow-400 transition">About</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-black mb-4 text-yellow-400 font-orbitron">LEGAL</h3>
              <ul className="space-y-2 text-yellow-200 text-sm font-bold font-rajdhani">
                <li><a href="#" className="hover:text-yellow-400 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition">Terms</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t-2 border-yellow-500 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-yellow-300 text-sm font-bold font-rajdhani">
              © 2026 ETHINX × PROMPTFORGE. Built by street-smart founders, for street-smart founders.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-yellow-300 hover:text-yellow-400 transition font-bold">Twitter</a>
              <a href="#" className="text-yellow-300 hover:text-yellow-400 transition font-bold">LinkedIn</a>
              <a href="#" className="text-yellow-300 hover:text-yellow-400 transition font-bold">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default EthinxBrandedLanding;
