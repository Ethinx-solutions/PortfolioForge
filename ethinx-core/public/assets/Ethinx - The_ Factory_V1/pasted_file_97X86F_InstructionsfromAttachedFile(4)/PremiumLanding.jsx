import React, { useState, useEffect } from 'react';
import { ChevronDown, Zap, Trophy, TrendingUp, Users, Target, Flame, Star, ArrowRight, Lock, Unlock, Crown } from 'lucide-react';

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
    { name: 'Gold', color: 'from-yellow-500 to-yellow-400', points: '1500-3000', icon: '🥇' },
    { name: 'Platinum', color: 'from-cyan-400 to-blue-400', points: '3000-7500', icon: '💎' },
    { name: 'Legendary', color: 'from-orange-500 to-red-500', points: '7500+', icon: '👑' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-5 gap-4">
        {badges.map((badge, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedBadge(idx)}
            className={`p-4 rounded-xl transition-all transform ${
              selectedBadge === idx
                ? `bg-gradient-to-br ${badge.color} scale-110 shadow-2xl`
                : 'bg-gray-700 hover:bg-gray-600 scale-100'
            }`}
          >
            <div className="text-3xl mb-2">{badge.icon}</div>
            <div className="text-xs font-bold">{badge.name}</div>
          </button>
        ))}
      </div>

      <div className={`bg-gradient-to-br ${badges[selectedBadge].color} rounded-2xl p-8 text-white shadow-2xl`}>
        <h3 className="text-3xl font-bold mb-2">{badges[selectedBadge].name} Badge</h3>
        <p className="text-lg mb-6">{badges[selectedBadge].points} Points</p>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star size={18} fill="white" />
            <span>Unlock exclusive community features</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy size={18} fill="white" />
            <span>Compete on leaderboards</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame size={18} fill="white" />
            <span>Earn streak bonuses</span>
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
          className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-orange-500 transition-all hover:bg-gray-800"
        >
          <div className="text-2xl font-bold text-orange-400 w-8">{founder.rank}</div>
          <div className="text-2xl">{founder.badge}</div>
          <div className="flex-1">
            <div className="font-bold">{founder.name}</div>
            <div className="text-sm text-gray-400">{founder.mrr} MRR</div>
          </div>
          <div className={`text-xl ${founder.trend === '↑' ? 'text-green-400' : founder.trend === '↓' ? 'text-red-400' : 'text-gray-400'}`}>
            {founder.trend}
          </div>
        </div>
      ))}
    </div>
  );
};

export function PremiumLanding() {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-black bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              PromptForge
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-orange-400 transition font-medium">Features</a>
            <a href="#gamification" className="text-gray-300 hover:text-orange-400 transition font-medium">Gamification</a>
            <a href="#testimonials" className="text-gray-300 hover:text-orange-400 transition font-medium">Success</a>
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-lg hover:shadow-orange-500/50">
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
                <div className="inline-block px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-full">
                  <span className="text-orange-300 text-sm font-bold">🚀 Join 500+ Street-Smart Founders</span>
                </div>

                <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                  Build{' '}
                  <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                    $100K MRR
                  </span>
                  {' '}in 4 Weeks
                </h1>

                <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
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
                    className="flex-1 px-6 py-4 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white placeholder-gray-500 font-medium transition-all"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-orange-500/50 whitespace-nowrap"
                  >
                    {submitted ? '✓ Sent!' : 'Start Free'}
                  </button>
                </form>

                <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-orange-400" />
                    <span>No credit card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-orange-400" />
                    <span>500+ using</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-orange-400" />
                    <span>78% success</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="relative h-96 lg:h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl blur-3xl opacity-30 animate-pulse" />
              <div className="relative bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-3xl border border-orange-500/30 p-8 backdrop-blur-sm h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4 animate-bounce">🐕</div>
                  <h2 className="text-3xl font-bold text-orange-300">T-Dog</h2>
                  <p className="text-orange-200 mt-2">Your Street-Smart Companion</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown size={28} className="text-orange-400" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-orange-500/5 to-blue-500/5 border-y border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-black text-orange-400 mb-2">
                <AnimatedCounter end={500} />+
              </div>
              <div className="text-gray-400 font-medium">Founders</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-orange-400 mb-2">
                $<AnimatedCounter end={50} />K
              </div>
              <div className="text-gray-400 font-medium">Avg MRR</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-orange-400 mb-2">4</div>
              <div className="text-gray-400 font-medium">Weeks to Launch</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-orange-400 mb-2">
                <AnimatedCounter end={78} />%
              </div>
              <div className="text-gray-400 font-medium">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-4">
              How <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">PromptForge</span> Works
            </h2>
            <p className="text-xl text-gray-400">From zero to $100K MRR in 4 weeks</p>
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
                className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-orange-500 transition-all hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2"
              >
                <feature.icon size={32} className="text-orange-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section id="gamification" className="py-32 px-6 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Badge System */}
            <div>
              <h2 className="text-4xl font-black mb-8">
                Meet <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">T-Dog</span>
              </h2>
              <GamificationPreview />
            </div>

            {/* Right: Leaderboard */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Live Leaderboard</h3>
              <LeaderboardPreview />
              <button className="mt-8 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-orange-500/50">
                View Full Leaderboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16">
            Founder <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Success Stories</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Chen', mrr: '$50K', time: '4 weeks', quote: 'PromptForge gave me the exact roadmap I needed.' },
              { name: 'Marcus Johnson', mrr: '$25K', time: '3 weeks', quote: 'I\'m not technical, but I\'m street-smart. PromptForge speaks my language.' },
              { name: 'Jennifer Lee', mrr: '$75K', time: '5 weeks', quote: 'The gamification system kept me motivated to push harder.' },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-orange-500 transition-all hover:shadow-2xl hover:shadow-orange-500/20"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="text-orange-400 fill-orange-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="border-t border-gray-700 pt-4">
                  <h3 className="font-bold">{testimonial.name}</h3>
                  <p className="text-sm text-orange-400">
                    {testimonial.mrr} MRR in {testimonial.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-y border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-6">
            Ready to Build Your <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">$100K Empire</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join 500+ street-smart founders building profitable digital businesses with PromptForge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-orange-500/50 inline-flex items-center justify-center gap-2">
              Start Free <ArrowRight size={20} />
            </button>
            <button className="bg-transparent border-2 border-orange-500 text-orange-400 hover:bg-orange-500/10 font-bold py-4 px-8 rounded-lg transition-all">
              View Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-bold mb-4 text-orange-400">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-orange-400 transition">Features</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-orange-400">Community</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-orange-400 transition">Leaderboard</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Discord</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-orange-400">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-orange-400 transition">About</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-orange-400">Legal</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-orange-400 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Terms</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2026 PromptForge. Built by street-smart founders, for street-smart founders.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PremiumLanding;
