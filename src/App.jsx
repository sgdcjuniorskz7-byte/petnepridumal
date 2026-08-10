import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PetCreator from './components/PetCreator';
import Dog from './components/Dog';
import Stats from './components/Stats';
import Controls from './components/Controls';
import LevelBar from './components/LevelBar';
import Achievements from './components/Achievements';
import GameMenu from './components/GameMenu';
import Menu from './components/Menu';
import Shop from './components/Shop';
import Storyline from './components/Storyline';
import Particles, { useParticles } from './components/Particles';
import { breeds } from './data/breeds';
import { usePetState } from './hooks/usePetState';
import { useSound } from './hooks/useSound';
import { useProgress } from './hooks/useProgress';
import { useStoryline } from './hooks/useStoryline';
import './App.css';

function App() {
  const {
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
  } = usePetState();

  const {
    playBark,
    playEat,
    playPurr,
    playHappy,
    playSplash,
    playSnore,
    playTrick,
    playWhoosh,
    playPop,
    playCoin,
    playClick,
  } = useSound();

  const {
    progress,
    newAchievement,
    addXp,
    addCoins,
    recordAction,
    getProgressToNextLevel,
  } = useProgress();

  const {
    currentChapter,
    activeQuest,
    showEvent: storyEvent,
    showChapterUnlock,
    getQuestProgress,
    updateQuestProgress,
    isQuestCompleted,
    isChapterCompleted,
    resetStory,
  } = useStoryline(progress.level, state.stats);

  const { particles, addParticles } = useParticles();
  const [message, setMessage] = useState(null);
  const [currentTrick, setCurrentTrick] = useState(null);
  const [currentAction, setCurrentAction] = useState(null);
  const [showCreator, setShowCreator] = useState(!petConfig);
  const [activeTab, setActiveTab] = useState('main');
  const [menuOpen, setMenuOpen] = useState(false);

  const showMessage = (text, duration = 2500) => {
    setMessage(text);
    setTimeout(() => setMessage(null), duration);
  };

  const handleCreateComplete = useCallback((config) => {
    setPetConfig(config);
    setShowCreator(false);
    showMessage(`🎉 ${config.name} создан!`);
    addXp(100);
  }, [setPetConfig, showMessage, addXp]);

  const handleAction = useCallback((action) => {
    setCurrentAction(action);
    updateQuestProgress(action);

    switch (action) {
      case 'feed':
        feed();
        playEat();
        addParticles('food', 4);
        addXp(10);
        recordAction('feed');
        break;
      case 'treat':
        treat();
        playCoin();
        addParticles('star', 5);
        addXp(15);
        addCoins(5);
        recordAction('treat');
        break;
      case 'water':
        water();
        playSplash();
        addParticles('spark', 3);
        addXp(10);
        recordAction('water');
        break;
      case 'pet':
        pet();
        playPurr();
        addParticles('heart', 6);
        addXp(5);
        recordAction('pet');
        break;
      case 'brush':
        brush();
        playWhoosh();
        addParticles('spark', 4);
        addXp(10);
        recordAction('brush');
        break;
      case 'wash':
        wash();
        playSplash();
        addParticles('spark', 5);
        addXp(10);
        recordAction('wash');
        break;
      case 'play':
        play();
        playBark();
        addParticles('spark', 8);
        addXp(20);
        recordAction('play');
        break;
      case 'walk':
        walk();
        playBark();
        addParticles('spark', 6);
        addXp(25);
        addCoins(10);
        recordAction('walk');
        break;
      case 'photo':
        photo();
        playPop();
        addParticles('star', 4);
        addXp(5);
        recordAction('photo');
        break;
      case 'sleep':
        sleep();
        playSnore();
        addParticles('zzz', 4);
        addXp(15);
        recordAction('sleep');
        break;
      case 'explore':
        playWhoosh();
        addParticles('star', 5);
        addXp(20);
        recordAction('explore');
        break;
    }

    setTimeout(() => setCurrentAction(null), 1500);
  }, [feed, treat, water, pet, brush, wash, play, walk, photo, sleep,
      playEat, playHappy, playPurr, playBark, playSplash, playSnore, playWhoosh, playPop, playCoin,
      addParticles, addXp, addCoins, recordAction, updateQuestProgress]);

  const handleTrick = useCallback((trick) => {
    setCurrentTrick(trick);
    updateQuestProgress('trick');

    const result = learnTrick(trick);
    if (result.isNew) {
      playTrick();
      addParticles('star', 10);
      addXp(50);
      recordAction('trick');
    } else {
      playBark();
      addParticles('heart', 3);
      addXp(5);
    }

    setTimeout(() => setCurrentTrick(null), 1500);
  }, [learnTrick, playTrick, playBark, addParticles, addXp, recordAction, updateQuestProgress]);

  const handleDogClick = useCallback(() => {
    playBark();
    addParticles('heart', 3);
    addXp(2);
  }, [playBark, addParticles, addXp]);

  const handleBuy = useCallback((item) => {
    addCoins(-item.price);
    if (item.effect.hunger) feed();
    if (item.effect.thirst) water();
    if (item.effect.happiness) { pet(); pet(); }
    if (item.effect.hygiene) wash();
    if (item.effect.energy) sleep();
    if (item.effect.mood) { pet(); }
    if (item.effect.xp) addXp(item.effect.xp);
    if (item.effect.coins) addCoins(item.effect.coins);
    addParticles('star', 6);
    showMessage(`Куплено: ${item.name}!`);
  }, [addCoins, feed, water, pet, wash, sleep, addXp, addParticles, showMessage]);

  const handlePlayGame = useCallback((gameId, score) => {
    const xpEarned = Math.floor(score * 1.5);
    const coinsEarned = Math.floor(score / 5);
    addXp(xpEarned);
    addCoins(coinsEarned);
    updateQuestProgress('game', score);
    showMessage(`🎮 +${xpEarned} XP, +${coinsEarned} 🪙`);
  }, [addXp, addCoins, showMessage, updateQuestProgress]);

  const handleReset = useCallback(() => {
    if (window.confirm('Вы уверены? Все данные будут удалены!')) {
      resetPet();
      resetStory();
      setShowCreator(true);
    }
  }, [resetPet, resetStory]);

  // Show creator if no pet config
  if (showCreator || !petConfig) {
    return <PetCreator onComplete={handleCreateComplete} />;
  }

  return (
    <div className="app">
      <Particles particles={particles} />

      <AnimatePresence>
        {message && (
          <motion.div
            className="toast-message"
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '16px 24px',
              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
              color: 'white',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4)',
              zIndex: 2000,
            }}
          >
            <span style={{ fontSize: '28px' }}>{newAchievement.emoji}</span>
            <div>
              <p style={{ margin: '0', fontSize: '14px', fontFamily: "'Fredoka', sans-serif", fontWeight: '600' }}>
                Достижение!
              </p>
              <p style={{ margin: '0', fontSize: '12px', opacity: 0.9 }}>
                {newAchievement.name}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Menu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelect={(id) => {
          setMenuOpen(false);
          if (id === 'reset') handleReset();
          else if (id === 'settings') setActiveTab('settings');
          else if (id === 'profile') setActiveTab('main');
          else if (id === 'help') showMessage('💡 Нажмите на питомца чтобы погладить!');
        }}
        petConfig={petConfig}
        state={state}
        progress={progress}
      />

      <AnimatePresence>
        {deathTimer !== null && deathTimer > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'fixed',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
              color: 'white',
              borderRadius: '16px',
              fontFamily: "'Fredoka', sans-serif",
              fontSize: '16px',
              fontWeight: '700',
              boxShadow: '0 8px 24px rgba(220, 38, 38, 0.5)',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <span>Помоги питомцу! {deathTimer}с</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ position: 'relative' }}
      >
        <motion.button
          onClick={() => setMenuOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'white', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: '4px',
            boxShadow: '2px 2px 6px #d4d4d4, -2px -2px 6px #ffffff',
          }}
        >
          <span style={{ width: '18px', height: '2px', background: '#374151', borderRadius: '1px' }} />
          <span style={{ width: '14px', height: '2px', background: '#374151', borderRadius: '1px' }} />
          <span style={{ width: '10px', height: '2px', background: '#374151', borderRadius: '1px' }} />
        </motion.button>
        <h1 className="title">🐕 Виртуальный Питомец</h1>
        <p className="subtitle">{state.name}</p>
        {(petConfig.breed || petConfig.breedId) && (
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '12px',
            color: '#9CA3AF',
            fontFamily: "'Nunito', sans-serif",
          }}>
            {(petConfig.breed || breeds.find(b => b.id === petConfig.breedId))?.emoji} {(petConfig.breed || breeds.find(b => b.id === petConfig.breedId))?.name}
          </p>
        )}
      </motion.header>

      <main className="main">
        <LevelBar
          level={progress.level}
          xp={progress.xp}
          coins={progress.coins}
          progressToNext={getProgressToNextLevel()}
        />

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '4px',
          background: 'white',
          borderRadius: '14px',
          boxShadow: '4px 4px 8px #d4d4d4, -4px -4px 8px #ffffff',
        }}>
          {[
            { id: 'main', label: '🏠 Основное', emoji: '🏠' },
            { id: 'story', label: '📖 Сюжет', emoji: '📖' },
            { id: 'shop', label: '🛒 Магазин', emoji: '🛒' },
            { id: 'games', label: '🎮 Игры', emoji: '🎮' },
            { id: 'achievements', label: '🏆 Достижения', emoji: '🏆' },
          ].map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                flex: 1,
                padding: '10px 8px',
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg, #F97316, #FB923C)'
                  : 'transparent',
                color: activeTab === tab.id ? 'white' : '#6B7280',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Fredoka', sans-serif",
                fontSize: '11px',
                fontWeight: '500',
              }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'main' && (
            <motion.div
              key="main"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <motion.div
                className="dog-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Dog
                  stats={state.stats}
                  isAnimating={isAnimating}
                  currentTrick={currentTrick}
                  currentAction={currentAction}
                  onClick={handleDogClick}
                  petConfig={petConfig}
                />
              </motion.div>

              <Stats stats={state.stats} />

              <Controls
                onAction={handleAction}
                onTrick={handleTrick}
                learnedTricks={state.tricks}
              />
            </motion.div>
          )}

          {activeTab === 'story' && (
            <motion.div
              key="story"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Storyline
                currentChapter={currentChapter}
                activeQuest={activeQuest}
                showEvent={storyEvent}
                showChapterUnlock={showChapterUnlock}
                getQuestProgress={getQuestProgress}
                isQuestCompleted={isQuestCompleted}
                isChapterCompleted={isChapterCompleted}
              />
            </motion.div>
          )}

          {activeTab === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Shop coins={progress.coins} onBuy={handleBuy} />
            </motion.div>
          )}

          {activeTab === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <GameMenu onPlayGame={handlePlayGame} />
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Achievements unlockedAchievements={progress.unlockedAchievements} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleReset}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            margin: '8px auto',
            padding: '10px 20px',
            background: 'transparent',
            color: '#9CA3AF',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            cursor: 'pointer',
            fontFamily: "'Fredoka', sans-serif",
            fontSize: '12px',
          }}
        >
          🔄 Новый питомец
        </motion.button>
      </main>

      <footer className="footer">
        <p>🐾 Нажмите на пёсика чтобы погладить</p>
      </footer>
    </div>
  );
}

export default App;
