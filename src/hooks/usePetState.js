import { useState, useEffect, useCallback, useRef } from 'react';
import { breeds } from '../data/breeds';

const STORAGE_KEY = 'virtual-pet-state';
const PET_CONFIG_KEY = 'virtual-pet-config';

const defaultStats = {
  hunger: 70,
  thirst: 65,
  happiness: 80,
  energy: 90,
  hygiene: 85,
  mood: 75,
};

const defaultState = {
  stats: defaultStats,
  name: 'Шарик',
  tricks: [],
  lastInteraction: Date.now(),
};

const defaultPetConfig = null;

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.tricks) parsed.tricks = [];
      if (parsed.stats.thirst === undefined) parsed.stats.thirst = 65;

      const timePassed = Date.now() - parsed.lastInteraction;
      const decayMinutes = timePassed / 60000;

      parsed.stats.hunger = Math.max(0, parsed.stats.hunger - decayMinutes * 0.5);
      parsed.stats.thirst = Math.max(0, parsed.stats.thirst - decayMinutes * 0.4);
      parsed.stats.happiness = Math.max(0, parsed.stats.happiness - decayMinutes * 0.3);
      parsed.stats.energy = Math.min(100, parsed.stats.energy + decayMinutes * 0.2);
      parsed.stats.hygiene = Math.max(0, parsed.stats.hygiene - decayMinutes * 0.1);

      const avg = (parsed.stats.hunger + parsed.stats.thirst + parsed.stats.happiness + parsed.stats.hygiene) / 4;
      parsed.stats.mood = Math.round(avg);

      return parsed;
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return { ...defaultState, stats: { ...defaultStats } };
}

function loadPetConfig() {
  try {
    const saved = localStorage.getItem(PET_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Всегда восстанавливаем breed из базы по breedId
      if (parsed.breedId) {
        parsed.breed = breeds.find(b => b.id === parsed.breedId) || null;
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load pet config:', e);
  }
  return defaultPetConfig;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      stats: state.stats,
      name: state.name,
      tricks: state.tricks,
      lastInteraction: Date.now(),
    }));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

function savePetConfig(config) {
  try {
    if (config) {
      // Сохраняем breedId вместо всего объекта breed для надёжности
      const toSave = {
        ...config,
        breedId: config.breed?.id,
        breed: undefined,
      };
      localStorage.setItem(PET_CONFIG_KEY, JSON.stringify(toSave));
    } else {
      localStorage.removeItem(PET_CONFIG_KEY);
    }
  } catch (e) {
    console.error('Failed to save pet config:', e);
  }
}

export function usePetState() {
  const [state, setState] = useState(loadState);
  const [petConfig, setPetConfigState] = useState(loadPetConfig);
  const [isAnimating, setIsAnimating] = useState(false);
  const [deathTimer, setDeathTimer] = useState(null);
  const tricksRef = useRef(state.tricks);
  const deathTimerRef = useRef(null);
  const deathTimeoutRef = useRef(null);
  const hasZeroRef = useRef(false);

  useEffect(() => {
    tricksRef.current = state.tricks;
  }, [state.tricks]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    savePetConfig(petConfig);
  }, [petConfig]);

  // Таймер смерти — 20 секунд на 0%
  useEffect(() => {
    const hasZero = state.stats.hunger <= 0 || state.stats.thirst <= 0
      || state.stats.happiness <= 0 || state.stats.energy <= 0 || state.stats.hygiene <= 0;

    // Только что появился 0% — запускаем таймер
    if (hasZero && !hasZeroRef.current) {
      hasZeroRef.current = true;
      setDeathTimer(20);

      const countdown = setInterval(() => {
        setDeathTimer(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      deathTimerRef.current = countdown;

      deathTimeoutRef.current = setTimeout(() => {
        setPetConfigState(null);
        setState({ ...defaultState, stats: { ...defaultStats } });
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(PET_CONFIG_KEY);
        hasZeroRef.current = false;
        setDeathTimer(null);
      }, 20000);
    }
    // Все показатели > 0 — сбрасываем таймер
    else if (!hasZero && hasZeroRef.current) {
      hasZeroRef.current = false;
      if (deathTimerRef.current) {
        clearInterval(deathTimerRef.current);
        deathTimerRef.current = null;
      }
      if (deathTimeoutRef.current) {
        clearTimeout(deathTimeoutRef.current);
        deathTimeoutRef.current = null;
      }
      setDeathTimer(null);
    }
  }, [state.stats]);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const s = { ...prev.stats };
        s.hunger = Math.max(0, s.hunger - 0.5);
        s.thirst = Math.max(0, s.thirst - 0.4);
        s.happiness = Math.max(0, s.happiness - 0.3);
        s.hygiene = Math.max(0, s.hygiene - 0.1);

        const avg = (s.hunger + s.thirst + s.happiness + s.hygiene) / 4;
        s.mood = Math.round(avg);

        return { ...prev, stats: s };
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const triggerAnimation = useCallback((duration) => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), duration);
  }, []);

  const updateStats = useCallback((changes) => {
    setState(prev => {
      const s = { ...prev.stats };
      Object.entries(changes).forEach(([key, val]) => {
        if (s[key] !== undefined) {
          s[key] = Math.max(0, Math.min(100, s[key] + val));
        }
      });

      const avg = (s.hunger + s.thirst + s.happiness + s.hygiene) / 4;
      s.mood = Math.round(avg);

      return { ...prev, stats: s };
    });
  }, []);

  const setPetConfig = useCallback((config) => {
    // Восстанавливаем breed если есть breedId
    const resolvedConfig = config ? {
      ...config,
      breed: config.breed || breeds.find(b => b.id === config.breedId) || null,
    } : null;

    setPetConfigState(resolvedConfig);
    if (resolvedConfig) {
      setState(prev => ({
        ...prev,
        name: resolvedConfig.name || prev.name,
        stats: resolvedConfig.breed?.baseStats
          ? { ...resolvedConfig.breed.baseStats, mood: 75 }
          : prev.stats,
      }));
    }
  }, []);

  const resetPet = useCallback(() => {
    setPetConfigState(null);
    setState({ ...defaultState, stats: { ...defaultStats } });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PET_CONFIG_KEY);
  }, []);

  // === ACTIONS ===

  const feed = useCallback(() => {
    triggerAnimation(1000);
    updateStats({ hunger: 25, happiness: 5 });
  }, [triggerAnimation, updateStats]);

  const treat = useCallback(() => {
    triggerAnimation(1000);
    updateStats({ hunger: 15, happiness: 20 });
  }, [triggerAnimation, updateStats]);

  const water = useCallback(() => {
    triggerAnimation(800);
    updateStats({ thirst: 30, happiness: 5 });
  }, [triggerAnimation, updateStats]);

  const pet = useCallback(() => {
    triggerAnimation(800);
    updateStats({ happiness: 20, mood: 10 });
  }, [triggerAnimation, updateStats]);

  const brush = useCallback(() => {
    triggerAnimation(1000);
    updateStats({ hygiene: 25, happiness: 10 });
  }, [triggerAnimation, updateStats]);

  const wash = useCallback(() => {
    triggerAnimation(1000);
    updateStats({ hygiene: 30, happiness: 5 });
  }, [triggerAnimation, updateStats]);

  const play = useCallback(() => {
    triggerAnimation(1200);
    updateStats({ happiness: 15, energy: -15, hunger: -10, thirst: -8 });
  }, [triggerAnimation, updateStats]);

  const walk = useCallback(() => {
    triggerAnimation(1500);
    updateStats({ happiness: 20, energy: -10, hunger: -5, thirst: -5, hygiene: -5 });
  }, [triggerAnimation, updateStats]);

  const photo = useCallback(() => {
    triggerAnimation(1200);
    updateStats({ happiness: 10 });
  }, [triggerAnimation, updateStats]);

  const sleep = useCallback(() => {
    triggerAnimation(1500);
    updateStats({ energy: 40, hunger: -5, thirst: -3 });
  }, [triggerAnimation, updateStats]);

  // === TRICKS ===

  const learnTrick = useCallback((trick) => {
    const currentTricks = tricksRef.current;
    const alreadyLearned = currentTricks.includes(trick);

    if (!alreadyLearned) {
      setState(prev => ({
        ...prev,
        tricks: [...prev.tricks, trick],
        stats: {
          ...prev.stats,
          happiness: Math.min(100, prev.stats.happiness + 10),
        },
      }));
      return { learned: true, isNew: true };
    }

    triggerAnimation(600);
    return { learned: true, isNew: false };
  }, [triggerAnimation]);

  return {
    state,
    petConfig,
    isAnimating,
    deathTimer,
    setPetConfig,
    resetPet,
    feed,
    treat,
    water,
    pet,
    brush,
    wash,
    play,
    walk,
    photo,
    sleep,
    learnTrick,
  };
}
