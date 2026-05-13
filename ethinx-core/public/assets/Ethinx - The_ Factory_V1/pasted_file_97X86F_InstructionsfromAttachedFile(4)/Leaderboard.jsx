import React, { useState } from 'react';
import { Trophy, TrendingUp, Users, Zap, Calendar } from 'lucide-react';

export function Leaderboard({ founders, category = 'MRR' }) {
  const [selectedCategory, setSelectedCategory] = useState(category);

  const categoryIcons = {
    MRR: <TrendingUp size={16} />,
    USERS: <Users size={16} />,
    GROWTH: <Zap size={16} />,
    SPEED: <Calendar size={16} />,
    CONSISTENCY: <Trophy size={16} />,
  };

  const categoryLabels = {
    MRR: 'Monthly Recurring Revenue',
    USERS: 'Total Users',
    GROWTH: 'Weekly Growth Rate',
    SPEED: 'Days to $10K',
    CONSISTENCY: 'Days Active',
  };

  const categoryValues = {
    MRR: (f) => `$${(f.currentMRR / 1000).toFixed(1)}K`,
    USERS: (f) => f.totalUsers.toLocaleString(),
    GROWTH: (f) => `${(f.weeklyGrowthRate * 100).toFixed(0)}%`,
    SPEED: (f) => `${f.daysToTenK} days`,
    CONSISTENCY: (f) => `${f.daysActive} days`,
  };

  const badgeColors = {
    bronze: 'bg-amber-700 text-amber-100',
    silver: 'bg-gray-400 text-gray-900',
    gold: 'bg-yellow-500 text-yellow-900',
    platinum: 'bg-blue-400 text-blue-900',
    legendary: 'bg-purple-600 text-purple-100',
  };

  const medalEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-orange-900 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trophy size={24} className="text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                selectedCategory === key
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {categoryIcons[key]}
              <span className="text-sm font-semibold">{key}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700 border-b border-gray-600">
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase">
                Founder
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase">
                Badge
              </th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-300 uppercase">
                {categoryLabels[selectedCategory]}
              </th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-300 uppercase">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {founders.map((founder, index) => (
              <tr
                key={founder.id}
                className={`border-b border-gray-700 transition-all hover:bg-gray-750 ${
                  index === 0 ? 'bg-yellow-900/20' : index === 1 ? 'bg-gray-700/20' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{medalEmojis[index]}</span>
                    <span className="text-lg font-bold text-white">
                      {founder.rank}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-white">{founder.name}</p>
                    <p className="text-xs text-gray-400">{founder.niche}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      badgeColors[founder.badge] || badgeColors.bronze
                    }`}
                  >
                    {founder.badge.charAt(0).toUpperCase() + founder.badge.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-lg font-bold text-orange-400">
                    {categoryValues[selectedCategory](founder)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-lg font-bold text-yellow-400">
                    {founder.points.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Stats */}
      <div className="bg-gray-700 px-6 py-4 flex justify-between text-sm">
        <div>
          <span className="text-gray-400">Total Founders: </span>
          <span className="font-bold text-white">{founders.length}</span>
        </div>
        <div>
          <span className="text-gray-400">Top MRR: </span>
          <span className="font-bold text-orange-400">
            ${(Math.max(...founders.map(f => f.currentMRR)) / 1000).toFixed(1)}K
          </span>
        </div>
        <div>
          <span className="text-gray-400">Avg Points: </span>
          <span className="font-bold text-yellow-400">
            {Math.round(
              founders.reduce((sum, f) => sum + f.points, 0) / founders.length
            ).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export function FounderCard({ founder, rank }) {
  const badgeStyles = {
    bronze: 'bg-amber-700 border-amber-500',
    silver: 'bg-gray-400 border-gray-300',
    gold: 'bg-yellow-500 border-yellow-400',
    platinum: 'bg-blue-400 border-blue-300',
    legendary: 'bg-purple-600 border-purple-400',
  };

  const medalEmojis = ['🥇', '🥈', '🥉'];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-orange-500 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">{medalEmojis[rank - 1] || '🏆'}</span>
            <h3 className="text-xl font-bold text-white">{founder.name}</h3>
          </div>
          <p className="text-sm text-gray-400">{founder.niche}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-white ${
            badgeStyles[founder.badge] || badgeStyles.bronze
          }`}
        >
          {rank}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-400 uppercase">MRR</p>
          <p className="text-lg font-bold text-orange-400">
            ${(founder.currentMRR / 1000).toFixed(1)}K
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase">Users</p>
          <p className="text-lg font-bold text-blue-400">
            {founder.totalUsers.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase">Points</p>
          <p className="text-lg font-bold text-yellow-400">
            {founder.points.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase">Days Active</p>
          <p className="text-lg font-bold text-green-400">
            {founder.daysActive}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 mb-2">Achievements: {founder.achievements?.length || 0}</p>
        <div className="flex gap-1 flex-wrap">
          {founder.achievements?.slice(0, 5).map((ach, i) => (
            <span
              key={i}
              className="text-lg"
              title={ach}
            >
              ⭐
            </span>
          ))}
          {founder.achievements?.length > 5 && (
            <span className="text-xs text-gray-400 self-center">
              +{founder.achievements.length - 5} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
