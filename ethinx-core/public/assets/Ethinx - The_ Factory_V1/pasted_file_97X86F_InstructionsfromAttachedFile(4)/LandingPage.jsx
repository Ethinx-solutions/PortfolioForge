import React, { useState } from 'react';
import { ChevronDown, Zap, Trophy, TrendingUp, Users, Target, Flame, Star, ArrowRight } from 'lucide-react';

export function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold gradient-text">PromptForge</div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-orange-400 transition">Features</a>
            <a href="#gamification" className="text-gray-300 hover:text-orange-400 transition">Gamification</a>
            <a href="#testimonials" className="text-gray-300 hover:text-orange-400 transition">Testimonials</a>
            <button className="btn-primary">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Build <span className="gradient-text">$100K MRR</span> in 4 Weeks
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  I might be tech dumb, but I'm street savvy. PromptForge gives you the AI-powered prompts and gamification system to build profitable digital businesses—fast.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                    required
                  />
                  <button type="submit" className="btn-primary">
                    {submitted ? '✓ Sent!' : 'Start Free'}
                  </button>
                </form>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-orange-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-orange-400" />
                  <span>500+ founders using</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-orange-400" />
                  <span>Proven results</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl blur-3xl opacity-20" />
              <img
                src="https://private-us-east-1.manuscdn.com/sessionFile/dK3gYNoDR2zV2UdVPsbEzc/sandbox/aHOgecokyBy14vig5oLurX-img-1_1770109450000_na1fn_cHJvbXB0Zm9yZ2UtbGFuZGluZy1oZXJv.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80"
                alt="T-Dog Hero"
                className="relative z-10 w-full rounded-2xl shadow-2xl glow-orange"
              />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown size={24} className="text-orange-400" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gray-800/50 border-y border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">500+</div>
              <div className="text-gray-400">Founders</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">$50K</div>
              <div className="text-gray-400">Avg MRR</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">4 Weeks</div>
              <div className="text-gray-400">To Launch</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">78%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            How <span className="gradient-text">PromptForge</span> Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass rounded-xl p-8 hover:border-orange-500 transition">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                <Target size={24} className="text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Answer 5 Questions</h3>
              <p className="text-gray-400">Tell us your goal, niche, timeline, and budget. Our AI analyzes 48 revenue combinations to find your optimal path.</p>
            </div>

            {/* Feature 2 */}
            <div className="glass rounded-xl p-8 hover:border-orange-500 transition">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                <Zap size={24} className="text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Get 48 Prompts</h3>
              <p className="text-gray-400">Receive AI-powered prompts optimized for your business. MVP builder, monetization, automation, growth—all included.</p>
            </div>

            {/* Feature 3 */}
            <div className="glass rounded-xl p-8 hover:border-orange-500 transition">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp size={24} className="text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Build & Scale</h3>
              <p className="text-gray-400">Execute the roadmap. Track revenue in real-time. Unlock achievements. Climb the leaderboard. Build your empire.</p>
            </div>

            {/* Feature 4 */}
            <div className="glass rounded-xl p-8 hover:border-orange-500 transition">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                <Trophy size={24} className="text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Gamification System</h3>
              <p className="text-gray-400">Earn points, unlock T-Dog badges, compete on leaderboards. Celebrate wins with the community.</p>
            </div>

            {/* Feature 5 */}
            <div className="glass rounded-xl p-8 hover:border-orange-500 transition">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                <Users size={24} className="text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Community</h3>
              <p className="text-gray-400">Join 500+ street-smart founders. Share wins. Get support. Build together. Celebrate success.</p>
            </div>

            {/* Feature 6 */}
            <div className="glass rounded-xl p-8 hover:border-orange-500 transition">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                <Flame size={24} className="text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Revenue Predictor</h3>
              <p className="text-gray-400">Real-time dashboard tracking MRR, users, conversion rate. See your growth projected week-by-week.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section id="gamification" className="py-20 px-6 bg-gray-800/30 border-y border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl blur-3xl opacity-20" />
              <img
                src="https://private-us-east-1.manuscdn.com/sessionFile/dK3gYNoDR2zV2UdVPsbEzc/sandbox/aHOgecokyBy14vig5oLurX-img-3_1770109455000_na1fn_cHJvbXB0Zm9yZ2UtZm91bmRlci1zdWNjZXNz.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80"
                alt="T-Dog Community"
                className="relative z-10 w-full rounded-2xl shadow-2xl glow-orange"
              />
            </div>

            {/* Right Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-4">
                  Meet <span className="gradient-text">T-Dog</span>
                </h2>
                <p className="text-xl text-gray-300">
                  Your street-smart companion on the journey to $100K MRR. Unlock badges, compete on leaderboards, and celebrate wins with the community.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star size={20} className="text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">5 Badge Levels</h3>
                    <p className="text-gray-400">Bronze → Silver → Gold → Platinum → Legendary</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Trophy size={20} className="text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">10 Achievements</h3>
                    <p className="text-gray-400">Unlock rewards for hitting milestones and helping others</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={20} className="text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Live Leaderboard</h3>
                    <p className="text-gray-400">Compete by MRR, users, growth rate, and consistency</p>
                  </div>
                </div>
              </div>

              <button className="btn-primary inline-flex items-center gap-2">
                View Dashboard <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Founder <span className="gradient-text">Success Stories</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="glass rounded-xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full" />
                <div>
                  <h3 className="font-bold">Sarah Chen</h3>
                  <p className="text-sm text-gray-400">$50K MRR in 4 weeks</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "PromptForge gave me the exact roadmap I needed. No more guessing. Just execute and watch the revenue grow."
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-orange-400 fill-orange-400" />
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="glass rounded-xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full" />
                <div>
                  <h3 className="font-bold">Marcus Johnson</h3>
                  <p className="text-sm text-gray-400">$25K MRR in 3 weeks</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "I'm not technical, but I'm street-smart. PromptForge speaks my language and delivers results."
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-orange-400 fill-orange-400" />
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="glass rounded-xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full" />
                <div>
                  <h3 className="font-bold">Jennifer Lee</h3>
                  <p className="text-sm text-gray-400">$75K MRR in 5 weeks</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "The gamification system kept me motivated. Seeing my badge level up made me push harder."
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-orange-400 fill-orange-400" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-y border-gray-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Build Your <span className="gradient-text">$100K Empire</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join 500+ street-smart founders building profitable digital businesses with PromptForge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary inline-flex items-center justify-center gap-2">
              Start Free <ArrowRight size={18} />
            </button>
            <button className="btn-secondary">
              View Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-orange-400 transition">Features</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-orange-400 transition">Leaderboard</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Discord</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-orange-400 transition">About</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-orange-400 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Terms</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between">
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

export default LandingPage;
