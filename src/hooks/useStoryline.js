import { useState, useEffect, useCallback, useRef } from 'react';
import { chapters, storyEvents } from '../data/storyline';

const STORY_KEY = 'virtual-pet-story';

function loadStory() {
  try {
    const saved = localStorage.getItem(STORY_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return {
    currentChapter: 1,
    completedChapters: [],
    completedQuests: [],
    questProgress: {},
    unlockedLocations: ['home'],
    storyLog: [],
  };
}

function saveStory(story) {
  try {
    localStorage.setItem(STORY_KEY, JSON.stringify(story));
  } catch (e) {}
}

export function useStoryline(level, stats) {
  const [story, setStory] = useState(loadStory);
  const [activeQuest, setActiveQuest] = useState(null);
  const [showEvent, setShowEvent] = useState(null);
  const [showChapterUnlock, setShowChapterUnlock] = useState(null);
  const lastLevelRef = useRef(level);

  useEffect(() => { saveStory(story); }, [story]);

  // Проверка главы по уровню
  useEffect(() => {
    const chapter = chapters.find(c => c.requiredLevel <= level && c.requiredLevel > (chapters[chapters.indexOf(c) - 1]?.requiredLevel || 0));
    if (chapter && chapter.id > story.currentChapter) {
      setStory(prev => ({
        ...prev,
        currentChapter: chapter.id,
        unlockedLocations: [...new Set([...prev.unlockedLocations, ...chapter.locations])],
        storyLog: [...prev.storyLog, { type: 'chapter', chapter: chapter.id, text: `Открыта новая глава: ${chapter.title}!`, time: Date.now() }],
      }));
      setShowChapterUnlock(chapter);
      setTimeout(() => setShowChapterUnlock(null), 4000);
    }
  }, [level]);

  // События по уровням
  useEffect(() => {
    const event = storyEvents.find(e => e.level === level && level > lastLevelRef.current);
    if (event) {
      setShowEvent(event);
      setTimeout(() => setShowEvent(null), 4000);
    }
    lastLevelRef.current = level;
  }, [level]);

  // Текущая глава
  const currentChapter = chapters.find(c => c.id === story.currentChapter) || chapters[0];

  // Активный квест
  const currentActiveQuest = currentChapter.quests.find(q => !story.completedQuests.includes(q.id)) || null;

  useEffect(() => {
    setActiveQuest(currentActiveQuest);
  }, [currentActiveQuest]);

  // Прогресс квеста
  const getQuestProgress = useCallback((questId) => {
    return story.questProgress[questId] || 0;
  }, [story.questProgress]);

  // Обновление прогресса квеста
  const updateQuestProgress = useCallback((action, value = 1) => {
    setStory(prev => {
      const quest = currentChapter.quests.find(q => !prev.completedQuests.includes(q.id));
      if (!quest) return prev;

      if (quest.target.action === action || quest.target.action === 'any') {
        const current = prev.questProgress[quest.id] || 0;
        const newProgress = current + value;

        if (newProgress >= quest.target.count) {
          const newUnlocked = quest.unlocks
            ? [...prev.unlockedLocations, quest.unlocks]
            : prev.unlockedLocations;

          const newCompletedQuests = [...prev.completedQuests, quest.id];

          // Проверяем, завершена ли глава
          const allQuestsDone = currentChapter.quests.every(q => newCompletedQuests.includes(q.id));
          const nextChapter = chapters.find(c => c.id === currentChapter.id + 1);

          if (allQuestsDone && nextChapter && !prev.completedChapters.includes(currentChapter.id)) {
            // Глава завершена — открываем следующую
            return {
              ...prev,
              completedQuests: newCompletedQuests,
              completedChapters: [...prev.completedChapters, currentChapter.id],
              currentChapter: nextChapter.id,
              questProgress: { ...prev.questProgress, [quest.id]: newProgress },
              unlockedLocations: [...new Set([...newUnlocked, ...nextChapter.locations])],
              storyLog: [
                ...prev.storyLog,
                { type: 'quest', questId: quest.id, text: `Квест выполнен: ${quest.title}`, time: Date.now() },
                { type: 'chapter', chapter: nextChapter.id, text: `Открыта новая глава: ${nextChapter.title}!`, time: Date.now() },
              ],
            };
          }

          return {
            ...prev,
            completedQuests: newCompletedQuests,
            questProgress: { ...prev.questProgress, [quest.id]: newProgress },
            unlockedLocations: [...new Set(newUnlocked)],
            storyLog: [...prev.storyLog, {
              type: 'quest',
              questId: quest.id,
              text: `Квест выполнен: ${quest.title}`,
              time: Date.now(),
            }],
          };
        }

        return {
          ...prev,
          questProgress: { ...prev.questProgress, [quest.id]: newProgress },
        };
      }

      return prev;
    });
  }, [currentChapter]);

  // Проверка выполнения квеста
  const isQuestCompleted = useCallback((questId) => {
    return story.completedQuests.includes(questId);
  }, [story.completedQuests]);

  // Проверка завершения главы
  const isChapterCompleted = useCallback(() => {
    return currentChapter.quests.every(q => story.completedQuests.includes(q.id));
  }, [currentChapter, story.completedQuests]);

  // Сброс стори
  const resetStory = useCallback(() => {
    setStory({
      currentChapter: 1,
      completedChapters: [],
      completedQuests: [],
      questProgress: {},
      unlockedLocations: ['home'],
      storyLog: [],
    });
  }, []);

  return {
    story,
    currentChapter,
    activeQuest,
    showEvent,
    showChapterUnlock,
    getQuestProgress,
    updateQuestProgress,
    isQuestCompleted,
    isChapterCompleted,
    resetStory,
  };
}
