/**
 * PromptForge Gamification System
 * T-Dog Achievement Badges, Leaderboards, and Rewards Logic
 */

// Achievement Tiers and Badges
export const ACHIEVEMENTS = {
  FIRST_PACK: {
    id: 'first_pack',
    name: 'First Pack',
    description: 'Purchased your first PromptForge pack',
    icon: '🎯',
    badge: 'tdog-minimalist-icon',
    points: 100,
    tier: 'bronze',
  },
  FIRST_REVENUE: {
    id: 'first_revenue',
    name: 'Revenue Maker',
    description: 'Generated your first $100 in revenue',
    icon: '💰',
    badge: 'tdog-pixel-art',
    points: 250,
    tier: 'silver',
  },
  TEN_K_MRR: {
    id: 'ten_k_mrr',
    name: 'Ten K Club',
    description: 'Reached $10K MRR',
    icon: '🥈',
    badge: 'tdog-minimalist-icon',
    points: 500,
    tier: 'silver',
  },
  FIFTY_K_MRR: {
    id: 'fifty_k_mrr',
    name: 'Fifty K Legend',
    description: 'Reached $50K MRR in 4 weeks',
    icon: '🥇',
    badge: 'tdog-action-pose',
    points: 1000,
    tier: 'gold',
  },
  HUNDRED_K_MRR: {
    id: 'hundred_k_mrr',
    name: 'Hundred K Empire',
    description: 'Reached $100K MRR',
    icon: '💎',
    badge: 'tdog-cyberpunk-neon',
    points: 2500,
    tier: 'platinum',
  },
  COMMUNITY_HELPER: {
    id: 'community_helper',
    name: 'Community Helper',
    description: 'Helped 5 other founders',
    icon: '🤝',
    badge: 'tdog-chibi-cute',
    points: 300,
    tier: 'silver',
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Completed MVP in under 7 days',
    icon: '⚡',
    badge: 'tdog-action-pose',
    points: 400,
    tier: 'gold',
  },
  CONSISTENCY: {
    id: 'consistency',
    name: 'Consistent Grinder',
    description: 'Logged in 30 days straight',
    icon: '📅',
    badge: 'tdog-minimalist-icon',
    points: 350,
    tier: 'silver',
  },
  VIRAL: {
    id: 'viral',
    name: 'Viral Sensation',
    description: 'Product reached 1K users in 1 week',
    icon: '🚀',
    badge: 'tdog-cyberpunk-neon',
    points: 750,
    tier: 'gold',
  },
  MENTOR: {
    id: 'mentor',
    name: 'Street-Smart Mentor',
    description: 'Mentored 3 new founders',
    icon: '👨‍🏫',
    badge: 'tdog-chibi-cute',
    points: 600,
    tier: 'gold',
  },
};

// Revenue Milestones and Predictions
export const REVENUE_MILESTONES = [
  { week: 1, revenue: 0, users: 50, conversion: 0.1 },
  { week: 2, revenue: 2500, users: 200, conversion: 0.15 },
  { week: 3, revenue: 25000, users: 500, conversion: 0.18 },
  { week: 4, revenue: 50000, users: 1000, conversion: 0.2 },
];

// Leaderboard Categories
export const LEADERBOARD_CATEGORIES = {
  MRR: 'Monthly Recurring Revenue',
  USERS: 'Total Users',
  GROWTH: 'Growth Rate',
  SPEED: 'Time to $10K MRR',
  CONSISTENCY: 'Days Active',
};

// T-Dog Badge Levels
export const TDOG_BADGES = {
  BRONZE: {
    level: 'bronze',
    name: 'Bronze T-Dog',
    minPoints: 0,
    maxPoints: 499,
    image: 'tdog-pixel-art',
    description: 'You\'re just getting started. Keep grinding!',
  },
  SILVER: {
    level: 'silver',
    name: 'Silver T-Dog',
    minPoints: 500,
    maxPoints: 1499,
    image: 'tdog-minimalist-icon',
    description: 'You\'re building momentum. Keep it up!',
  },
  GOLD: {
    level: 'gold',
    name: 'Gold T-Dog',
    minPoints: 1500,
    maxPoints: 3499,
    image: 'tdog-action-pose',
    description: 'You\'re a street-smart founder. Dominate!',
  },
  PLATINUM: {
    level: 'platinum',
    name: 'Platinum T-Dog',
    minPoints: 3500,
    maxPoints: 9999,
    image: 'tdog-cyberpunk-neon',
    description: 'You\'re unstoppable. You\'re a legend!',
  },
  LEGENDARY: {
    level: 'legendary',
    name: 'Legendary T-Dog',
    minPoints: 10000,
    maxPoints: Infinity,
    image: 'tdog-neon-cyberpunk',
    description: 'You\'re a street-smart empire builder!',
  },
};

/**
 * Calculate current T-Dog badge level based on points
 */
export function calculateBadgeLevel(points) {
  if (points >= TDOG_BADGES.LEGENDARY.minPoints) return TDOG_BADGES.LEGENDARY;
  if (points >= TDOG_BADGES.PLATINUM.minPoints) return TDOG_BADGES.PLATINUM;
  if (points >= TDOG_BADGES.GOLD.minPoints) return TDOG_BADGES.GOLD;
  if (points >= TDOG_BADGES.SILVER.minPoints) return TDOG_BADGES.SILVER;
  return TDOG_BADGES.BRONZE;
}

/**
 * Calculate revenue projection based on week and niche
 */
export function projectRevenue(week, niche = 'general', baseConversion = 0.15) {
  const milestone = REVENUE_MILESTONES[Math.min(week - 1, 3)];
  
  // Niche multipliers
  const nicheMultipliers = {
    productivity: 1.2,
    ecommerce: 1.5,
    saas: 1.3,
    content: 0.9,
    automation: 1.4,
    general: 1.0,
  };

  const multiplier = nicheMultipliers[niche] || 1.0;
  return Math.round(milestone.revenue * multiplier);
}

/**
 * Calculate points earned from achievement
 */
export function calculatePoints(achievement, multiplier = 1) {
  return Math.round(achievement.points * multiplier);
}

/**
 * Get next milestone for founder
 */
export function getNextMilestone(currentMRR) {
  const milestones = [
    { amount: 1000, name: '$1K MRR', icon: '🎯' },
    { amount: 5000, name: '$5K MRR', icon: '💰' },
    { amount: 10000, name: '$10K MRR', icon: '🥈' },
    { amount: 25000, name: '$25K MRR', icon: '🏆' },
    { amount: 50000, name: '$50K MRR', icon: '🥇' },
    { amount: 100000, name: '$100K MRR', icon: '💎' },
    { amount: 250000, name: '$250K MRR', icon: '👑' },
    { amount: 500000, name: '$500K MRR', icon: '🌟' },
  ];

  return milestones.find(m => m.amount > currentMRR) || milestones[milestones.length - 1];
}

/**
 * Calculate progress to next milestone
 */
export function calculateMilestoneProgress(currentMRR) {
  const milestones = [
    { amount: 1000 },
    { amount: 5000 },
    { amount: 10000 },
    { amount: 25000 },
    { amount: 50000 },
    { amount: 100000 },
  ];

  const currentMilestoneIndex = milestones.findIndex(m => m.amount > currentMRR);
  const nextMilestone = milestones[currentMilestoneIndex];
  const previousMilestone = currentMilestoneIndex > 0 ? milestones[currentMilestoneIndex - 1] : { amount: 0 };

  if (!nextMilestone) return 100;

  const progress = ((currentMRR - previousMilestone.amount) / (nextMilestone.amount - previousMilestone.amount)) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

/**
 * Unlock achievement if conditions are met
 */
export function checkAchievements(founderData) {
  const unlockedAchievements = [];

  // Check each achievement condition
  if (founderData.packsOwned > 0 && !founderData.achievements.includes('first_pack')) {
    unlockedAchievements.push(ACHIEVEMENTS.FIRST_PACK);
  }

  if (founderData.currentMRR >= 100 && !founderData.achievements.includes('first_revenue')) {
    unlockedAchievements.push(ACHIEVEMENTS.FIRST_REVENUE);
  }

  if (founderData.currentMRR >= 10000 && !founderData.achievements.includes('ten_k_mrr')) {
    unlockedAchievements.push(ACHIEVEMENTS.TEN_K_MRR);
  }

  if (founderData.currentMRR >= 50000 && !founderData.achievements.includes('fifty_k_mrr')) {
    unlockedAchievements.push(ACHIEVEMENTS.FIFTY_K_MRR);
  }

  if (founderData.currentMRR >= 100000 && !founderData.achievements.includes('hundred_k_mrr')) {
    unlockedAchievements.push(ACHIEVEMENTS.HUNDRED_K_MRR);
  }

  if (founderData.helpedFounders >= 5 && !founderData.achievements.includes('community_helper')) {
    unlockedAchievements.push(ACHIEVEMENTS.COMMUNITY_HELPER);
  }

  if (founderData.mvpDays <= 7 && !founderData.achievements.includes('speed_demon')) {
    unlockedAchievements.push(ACHIEVEMENTS.SPEED_DEMON);
  }

  if (founderData.daysActive >= 30 && !founderData.achievements.includes('consistency')) {
    unlockedAchievements.push(ACHIEVEMENTS.CONSISTENCY);
  }

  if (founderData.weekOneUsers >= 1000 && !founderData.achievements.includes('viral')) {
    unlockedAchievements.push(ACHIEVEMENTS.VIRAL);
  }

  if (founderData.mentorCount >= 3 && !founderData.achievements.includes('mentor')) {
    unlockedAchievements.push(ACHIEVEMENTS.MENTOR);
  }

  return unlockedAchievements;
}

/**
 * Calculate total points from achievements
 */
export function calculateTotalPoints(achievements) {
  return achievements.reduce((total, achId) => {
    const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === achId);
    return total + (achievement?.points || 0);
  }, 0);
}

/**
 * Generate leaderboard data
 */
export function generateLeaderboard(founders, category = 'MRR') {
  const sorted = [...founders].sort((a, b) => {
    switch (category) {
      case 'MRR':
        return b.currentMRR - a.currentMRR;
      case 'USERS':
        return b.totalUsers - a.totalUsers;
      case 'GROWTH':
        return b.weeklyGrowthRate - a.weeklyGrowthRate;
      case 'SPEED':
        return a.daysToTenK - b.daysToTenK;
      case 'CONSISTENCY':
        return b.daysActive - a.daysActive;
      default:
        return 0;
    }
  });

  return sorted.slice(0, 10).map((founder, index) => ({
    rank: index + 1,
    ...founder,
    badge: calculateBadgeLevel(founder.points).level,
  }));
}

/**
 * Calculate streak bonus
 */
export function calculateStreakBonus(daysActive) {
  if (daysActive < 7) return 1.0;
  if (daysActive < 14) return 1.1;
  if (daysActive < 30) return 1.25;
  if (daysActive < 60) return 1.5;
  return 2.0;
}

/**
 * Format currency
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format large numbers
 */
export function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export default {
  ACHIEVEMENTS,
  REVENUE_MILESTONES,
  LEADERBOARD_CATEGORIES,
  TDOG_BADGES,
  calculateBadgeLevel,
  projectRevenue,
  calculatePoints,
  getNextMilestone,
  calculateMilestoneProgress,
  checkAchievements,
  calculateTotalPoints,
  generateLeaderboard,
  calculateStreakBonus,
  formatCurrency,
  formatNumber,
};
