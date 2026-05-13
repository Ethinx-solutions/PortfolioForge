import React, { useState, useEffect } from 'react';
import { RevenueChart, UsersChart, ConversionChart } from './RevenueChart';
import { AchievementBadge, TDogBadgeDisplay, AchievementGrid, MilestoneProgress } from './AchievementBadge';
import { Leaderboard, FounderCard } from './Leaderboard';
import {
  ACHIEVEMENTS,
  REVENUE_MILESTONES,
  calculateBadgeLevel,
  checkAchievements,
  calculateTotalPoints,
  generateLeaderboard,
  getNextMilestone,
  calculateMilestoneProgress,
  formatCurrency,
  formatNumber,
} from '../lib/gamification';
import { TrendingUp, Users, Zap, Trophy, Target, Flame } from 'lucide-react';

export function Dashboard() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [founderData, setFounderData] = useState({
    id: 'founder-1',
    name: 'Troy "T-Dog" Napier',
    niche: 'SaaS',
    currentMRR: 12400,
    totalUsers: 500,
    packsOwned: 1,
    achievements: ['first_pack', 'first_revenue', 'ten_k_mrr'],
    helpedFounders: 2,
    mvpDays: 6,
    daysActive: 45,
    weekOneUsers: 200,
    mentorCount: 1,
    daysToTenK: 14,
    weeklyGrowthRate: 0.35,
  });

  const [mockLeaderboard, setMockLeaderboard] = useState([]);
  const [newAchievements, setNewAchievements] = useState([]);

  // Initialize leaderboard with mock data
  useEffect(() => {
    const mockFounders = [
      {
        id: 'founder-1',
        name: 'Troy "T-Dog" Napier',
        niche: 'SaaS',
        currentMRR: 50000,
        totalUsers: 1000,
        points: 1250,
        badge: 'gold',
        weeklyGrowthRate: 0.35,
        daysToTenK: 14,
        daysActive: 45,
        achievements: ['first_pack', 'first_revenue', 'fifty_k_mrr'],
        rank: 1,
      },
      {
        id: 'founder-2',
        name: 'Sarah Chen',
        niche: 'Productivity',
        currentMRR: 25000,
        totalUsers: 500,
        points: 850,
        badge: 'silver',
        weeklyGrowthRate: 0.28,
        daysToTenK: 18,
        daysActive: 35,
        achievements: ['first_pack', 'first_revenue', 'ten_k_mrr'],
        rank: 2,
      },
      {
        id: 'founder-3',
        name: 'Marcus Johnson',
        niche: 'Automation',
        currentMRR: 15000,
        totalUsers: 300,
        points: 650,
        badge: 'silver',
        weeklyGrowthRate: 0.22,
        daysToTenK: 21,
        daysActive: 28,
        achievements: ['first_pack', 'first_revenue'],
        rank: 3,
      },
      {
        id: 'founder-4',
        name: 'Jennifer Lee',
        niche: 'Content',
        currentMRR: 8500,
        totalUsers: 250,
        points: 450,
        badge: 'bronze',
        weeklyGrowthRate: 0.18,
        daysToTenK: 25,
        daysActive: 20,
        achievements: ['first_pack'],
        rank: 4,
      },
      {
        id: 'founder-5',
        name: 'David Martinez',
        niche: 'E-commerce',
        currentMRR: 35000,
        totalUsers: 750,
        points: 1050,
        badge: 'gold',
        weeklyGrowthRate: 0.32,
        daysToTenK: 16,
        daysActive: 40,
        achievements: ['first_pack', 'first_revenue', 'fifty_k_mrr'],
        rank: 5,
      },
    ];

    setMockLeaderboard(mockFounders);
  }, []);

  // Check for new achievements
  useEffect(() => {
    const unlocked = checkAchievements(founderData);
    setNewAchievements(unlocked);
  }, [founderData]);

  const currentBadge = calculateBadgeLevel(
    calculateTotalPoints(founderData.achievements)
  );
  const nextMilestone = getNextMilestone(founderData.currentMRR);
  const milestoneProgress = calculateMilestoneProgress(founderData.currentMRR);
  const allAchievements = Object.values(ACHIEVEMENTS);

  const handleWeekChange = (week) => {
    setCurrentWeek(week);
    // Update founder data based on week
    const projection = REVENUE_MILESTONES[Math.min(week - 1, 3)];
    setFounderData(prev => ({
      ...prev,
      currentMRR: projection.revenue * 1.2, // SaaS multiplier
      totalUsers: projection.users * 1.2,
    }));
  };

  const handleSimulateAchievement = () => {
    const randomAchievement = allAchievements[
      Math.floor(Math.random() * allAchievements.length)
    ];
    if (!founderData.achievements.includes(randomAchievement.id)) {
      setFounderData(prev => ({
        ...prev,
        achievements: [...prev.achievements, randomAchievement.id],
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-2">
              PromptForge Dashboard
            </h1>
            <p className="text-gray-400">
              Revenue Predictor • Gamification • Leaderboard
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Week {currentWeek}</p>
            <p className="text-2xl font-bold text-orange-400">
              {formatCurrency(founderData.currentMRR)}
            </p>
          </div>
        </div>

        {/* Week Selector */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map(week => (
            <button
              key={week}
              onClick={() => handleWeekChange(week)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                currentWeek === week
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Week {week}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-orange-500 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm uppercase">MRR</p>
                <p className="text-3xl font-bold text-orange-400 mt-2">
                  {formatCurrency(founderData.currentMRR)}
                </p>
              </div>
              <TrendingUp size={32} className="text-orange-500 opacity-50" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm uppercase">Users</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">
                  {formatNumber(founderData.totalUsers)}
                </p>
              </div>
              <Users size={32} className="text-blue-500 opacity-50" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm uppercase">Points</p>
                <p className="text-3xl font-bold text-yellow-400 mt-2">
                  {calculateTotalPoints(founderData.achievements).toLocaleString()}
                </p>
              </div>
              <Zap size={32} className="text-yellow-500 opacity-50" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm uppercase">Achievements</p>
                <p className="text-3xl font-bold text-purple-400 mt-2">
                  {founderData.achievements.length}/{allAchievements.length}
                </p>
              </div>
              <Trophy size={32} className="text-purple-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* T-Dog Badge and Milestone */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 flex flex-col items-center justify-center">
            <TDogBadgeDisplay
              badge={currentBadge}
              points={calculateTotalPoints(founderData.achievements)}
            />
          </div>

          <div className="space-y-4">
            <MilestoneProgress
              currentMRR={founderData.currentMRR}
              nextMilestone={nextMilestone}
              progress={milestoneProgress}
            />
            <button
              onClick={handleSimulateAchievement}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-orange-500/50"
            >
              <Flame size={18} className="inline mr-2" />
              Simulate Achievement
            </button>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div style={{ height: '300px' }}>
              <RevenueChart data={REVENUE_MILESTONES} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div style={{ height: '300px' }}>
              <UsersChart data={REVENUE_MILESTONES} />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div style={{ height: '300px' }}>
            <ConversionChart data={REVENUE_MILESTONES} />
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Trophy size={24} className="text-yellow-400" />
            Achievements
          </h2>
          <AchievementGrid
            achievements={allAchievements}
            unlockedIds={founderData.achievements}
          />
        </div>

        {/* Leaderboard */}
        <div>
          <Leaderboard founders={mockLeaderboard} category="MRR" />
        </div>

        {/* Top Founders Cards */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Top Founders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockLeaderboard.slice(0, 3).map((founder, index) => (
              <FounderCard
                key={founder.id}
                founder={founder}
                rank={index + 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-700">
        <p className="text-center text-gray-400 text-sm">
          PromptForge © 2026 • Street-Smart Founders Building $100K MRR Businesses
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
