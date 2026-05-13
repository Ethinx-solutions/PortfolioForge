import React from 'react';
import { Trophy, Star, Zap, Heart } from 'lucide-react';

export function AchievementBadge({ achievement, unlocked = false }) {
  const badgeColors = {
    bronze: 'bg-amber-700',
    silver: 'bg-gray-400',
    gold: 'bg-yellow-500',
    platinum: 'bg-blue-400',
    legendary: 'bg-purple-600',
  };

  const borderColors = {
    bronze: 'border-amber-600',
    silver: 'border-gray-300',
    gold: 'border-yellow-400',
    platinum: 'border-blue-300',
    legendary: 'border-purple-500',
  };

  return (
    <div
      className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
        unlocked
          ? `${badgeColors[achievement.tier]} ${borderColors[achievement.tier]} shadow-lg scale-105`
          : 'bg-gray-700 border-gray-600 opacity-50'
      }`}
    >
      <div className="text-4xl mb-2">{achievement.icon}</div>
      <h3 className="text-sm font-bold text-white text-center mb-1">
        {achievement.name}
      </h3>
      <p className="text-xs text-gray-100 text-center mb-2">
        {achievement.description}
      </p>
      <div className="flex items-center gap-1 text-xs font-bold">
        <Star size={12} className="text-yellow-300" />
        <span className="text-yellow-300">{achievement.points} pts</span>
      </div>
      {!unlocked && (
        <div className="mt-2 text-xs text-gray-300 italic">Locked</div>
      )}
    </div>
  );
}

export function TDogBadgeDisplay({ badge, points }) {
  const badgeStyles = {
    bronze: {
      bg: 'bg-gradient-to-br from-amber-700 to-amber-900',
      border: 'border-amber-500',
      glow: 'shadow-amber-500/50',
    },
    silver: {
      bg: 'bg-gradient-to-br from-gray-400 to-gray-600',
      border: 'border-gray-300',
      glow: 'shadow-gray-400/50',
    },
    gold: {
      bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      border: 'border-yellow-300',
      glow: 'shadow-yellow-400/50',
    },
    platinum: {
      bg: 'bg-gradient-to-br from-blue-400 to-blue-600',
      border: 'border-blue-300',
      glow: 'shadow-blue-400/50',
    },
    legendary: {
      bg: 'bg-gradient-to-br from-purple-500 to-purple-700',
      border: 'border-purple-300',
      glow: 'shadow-purple-500/50',
    },
  };

  const style = badgeStyles[badge.level] || badgeStyles.bronze;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-32 h-32 rounded-full border-4 ${style.bg} ${style.border} flex items-center justify-center shadow-2xl ${style.glow}`}
      >
        <div className="text-6xl animate-pulse">{badge.image === 'tdog-chibi-cute' ? '🐕' : '⚔️'}</div>
      </div>
      <h2 className="text-2xl font-bold text-white mt-4 text-center">
        {badge.name}
      </h2>
      <p className="text-gray-300 text-center mt-2 max-w-xs">
        {badge.description}
      </p>
      <div className="mt-4 flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full border border-gray-700">
        <Star size={16} className="text-yellow-400" />
        <span className="text-yellow-400 font-bold">{points} points</span>
      </div>
    </div>
  );
}

export function AchievementGrid({ achievements, unlockedIds = [] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {achievements.map((achievement) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          unlocked={unlockedIds.includes(achievement.id)}
        />
      ))}
    </div>
  );
}

export function MilestoneProgress({ currentMRR, nextMilestone, progress }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase">
            Next Milestone
          </h3>
          <p className="text-2xl font-bold text-white mt-1">
            {nextMilestone.name}
          </p>
        </div>
        <div className="text-4xl">{nextMilestone.icon}</div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Progress</span>
          <span className="text-white font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-600 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>${(currentMRR / 1000).toFixed(1)}K</span>
          <span>${(nextMilestone.amount / 1000).toFixed(0)}K</span>
        </div>
      </div>
    </div>
  );
}
