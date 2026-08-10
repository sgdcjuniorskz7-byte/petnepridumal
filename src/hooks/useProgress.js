import { useState, useEffect, useCallback } from 'react';
import { achievements, levelThresholds, dailyRewards } from '../data/achievements';

const PROGRESS_KEY = 'virtual-pet-progress';

function loadProgress() {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load progress:', e);
  }
  return {
    xp: 0,
    level: 1,
    coins: 0,
    unlockedAchievements: [],
    stats: {},
    streak: 0,
    lastPlayDate: null,
  };
}

function saveProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

function calculateLevel(xp) {
  let level = 1;
  for (const threshold of levelThresholds) {
    if (xp >= threshold.xpRequired) {
      level = threshold.level;
    } else {
      break;
    }
  }
  return level;
}

function getXpForNextLevel(level) {
  const next = levelThresholds.find(t => t.level === level + 1);
  return next ? next.xpRequired : Infinity;
}

function getXpForCurrentLevel(level) {
  const current = levelThresholds.find(t => t.level === level);
  return current ? current.xpRequired : 0;
}

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress);
  const [newAchievement, setNewAchievement] = useState(null);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    const today = new Date().toDateString();
    if (progress.lastPlayDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = progress.lastPlayDate === yesterday.toDateString();

      setProgress(prev => ({
        ...prev,
        streak: isConsecutive ? prev.streak + 1 : 1,
        lastPlayDate: today,
      }));
    }
  }, []);

  const addXp = useCallback((amount) => {
    setProgress(prev => {
      const newXp = prev.xp + amount;
      const newLevel = calculateLevel(newXp);

      if (newLevel > prev.level) {
        checkAchievements({
          ...prev,
          xp: newXp,
          level: newLevel,
          stats: { ...prev.stats, level: newLevel },
        });
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
      };
    });
  }, []);

  const addCoins = useCallback((amount) => {
    setProgress(prev => ({
      ...prev,
      coins: prev.coins + amount,
    }));
  }, []);

  const recordAction = useCallback((action) => {
    setProgress(prev => {
      const newStats = {
        ...prev.stats,
        [action]: (prev.stats[action] || 0) + 1,
      };

      checkAchievements({ ...prev, stats: newStats });

      return {
        ...prev,
        stats: newStats,
      };
    });
  }, []);

  const checkAchievements = useCallback((currentProgress) => {
    achievements.forEach(achievement => {
      if (currentProgress.unlockedAchievements.includes(achievement.id)) return;

      let unlocked = false;

      switch (achievement.condition) {
        case 'feed':
        case 'water':
        case 'pet':
        case 'brush':
        case 'wash':
        case 'play':
        case 'walk':
        case 'photo':
        case 'trick':
          unlocked = (currentProgress.stats[achievement.condition] || 0) >= achievement.target;
          break;
        case 'level':
          unlocked = currentProgress.level >= achievement.target;
          break;
        case 'happiness_100':
          unlocked = currentProgress.stats.happiness_100 >= 1;
          break;
        case 'day_survived':
          unlocked = currentProgress.stats.days_played >= 1;
          break;
        case 'streak_7':
          unlocked = currentProgress.streak >= 7;
          break;
        default:
          break;
      }

      if (unlocked) {
        setProgress(prev => ({
          ...prev,
          unlockedAchievements: [...prev.unlockedAchievements, achievement.id],
        }));
        setNewAchievement(achievement);
        setTimeout(() => setNewAchievement(null), 3000);
      }
    });
  }, []);

  const getDailyReward = useCallback(() => {
    const today = new Date().toDateString();
    const lastReward = progress.lastRewardDate;

    if (lastReward === today) return null;

    const day = (progress.streak % 7) + 1;
    const reward = dailyRewards.find(r => r.day === day);

    if (reward) {
      setProgress(prev => ({
        ...prev,
        lastRewardDate: today,
        xp: prev.xp + reward.xp,
        coins: prev.coins + reward.coins,
        level: calculateLevel(prev.xp + reward.xp),
      }));
      return reward;
    }

    return null;
  }, [progress.streak, progress.lastRewardDate]);

  const getProgressToNextLevel = useCallback(() => {
    const currentXp = progress.xp - getXpForCurrentLevel(progress.level);
    const requiredXp = getXpForNextLevel(progress.level) - getXpForCurrentLevel(progress.level);
    return Math.min(100, (currentXp / requiredXp) * 100);
  }, [progress.xp, progress.level]);

  return {
    progress,
    newAchievement,
    addXp,
    addCoins,
    recordAction,
    getDailyReward,
    getProgressToNextLevel,
    levelThresholds,
  };
}
