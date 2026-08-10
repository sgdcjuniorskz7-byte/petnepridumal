import { motion, AnimatePresence } from 'framer-motion';

const actionIcons = {
  feed: '🍖',
  treat: '🦴',
  water: '💧',
  pet: '❤️',
  brush: '🪮',
  wash: '🛁',
  play: '⚽',
  walk: '🚶',
  photo: '📸',
  sleep: '😴',
  trick: '🎪',
  explore: '🔍',
  game: '🎮',
  any: '✨',
  level: '⭐',
};

function QuestCard({ quest, progress, isCompleted, isActive }) {
  const percent = Math.min(100, (progress / quest.target.count) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        padding: '14px',
        background: isCompleted ? 'linear-gradient(135deg, #22C55E, #16A34A)' : isActive ? '#FFF7ED' : '#F9FAFB',
        borderRadius: '16px',
        border: isActive ? '2px solid #F97316' : isCompleted ? '2px solid #22C55E' : '2px solid #E5E7EB',
        opacity: isCompleted ? 0.85 : 1,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <span style={{ fontSize: '22px' }}>{quest.icon}</span>
        <div style={{ flex: 1 }}>
          <p style={{
            margin: 0, fontSize: '14px', fontFamily: "'Fredoka', sans-serif",
            fontWeight: '600', color: isCompleted ? 'white' : '#374151',
            textDecoration: isCompleted ? 'line-through' : 'none',
          }}>
            {quest.title}
          </p>
          <p style={{
            margin: '2px 0 0', fontSize: '11px', fontFamily: "'Nunito', sans-serif",
            color: isCompleted ? 'rgba(255,255,255,0.8)' : '#6B7280',
          }}>
            {quest.description}
          </p>
        </div>
        {isCompleted && <span style={{ fontSize: '18px' }}>✅</span>}
      </div>

      {!isCompleted && (
        <div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginBottom: '4px',
            fontSize: '11px', fontFamily: "'Fredoka', sans-serif",
          }}>
            <span style={{ color: '#6B7280' }}>
              {actionIcons[quest.target.action]} {progress}/{quest.target.count}
            </span>
            <span style={{ color: '#F97316', fontWeight: '600' }}>
              +{quest.xpReward} XP · +{quest.coinsReward} 🪙
            </span>
          </div>
          <div style={{
            height: '6px', background: '#E5E7EB', borderRadius: '3px', overflow: 'hidden',
          }}>
            <motion.div
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5 }}
              style={{
                height: '100%',
                background: percent >= 100 ? '#22C55E' : 'linear-gradient(90deg, #F97316, #FB923C)',
                borderRadius: '3px',
              }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function Storyline({
  currentChapter,
  activeQuest,
  showEvent,
  showChapterUnlock,
  getQuestProgress,
  isQuestCompleted,
  isChapterCompleted,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', flexDirection: 'column', gap: '14px',
        padding: '14px', background: 'white', borderRadius: '20px',
        boxShadow: '8px 8px 16px #d4d4d4, -8px -8px 16px #ffffff',
      }}
    >
      {/* Заголовок главы */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px', background: `linear-gradient(135deg, ${currentChapter.color}22, ${currentChapter.color}11)`,
        borderRadius: '14px', border: `1px solid ${currentChapter.color}33`,
      }}>
        <span style={{ fontSize: '32px' }}>{currentChapter.icon}</span>
        <div style={{ flex: 1 }}>
          <p style={{
            margin: 0, fontSize: '16px', fontFamily: "'Fredoka', sans-serif",
            fontWeight: '700', color: currentChapter.color,
          }}>
            Глава {currentChapter.id}: {currentChapter.title}
          </p>
          <p style={{
            margin: '2px 0 0', fontSize: '12px', fontFamily: "'Nunito', sans-serif",
            color: '#6B7280',
          }}>
            {currentChapter.subtitle}
          </p>
        </div>
      </div>

      {/* Описание */}
      <p style={{
        margin: 0, fontSize: '13px', fontFamily: "'Nunito', sans-serif",
        color: '#374151', lineHeight: '1.4',
      }}>
        {currentChapter.description}
      </p>

      {/* Квесты */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {currentChapter.quests.map((quest, i) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            progress={getQuestProgress(quest.id)}
            isCompleted={isQuestCompleted(quest.id)}
            isActive={activeQuest?.id === quest.id}
          />
        ))}
      </div>

      {/* Завершение главы */}
      {isChapterCompleted() && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            padding: '14px', background: `linear-gradient(135deg, ${currentChapter.color}, ${currentChapter.color}CC)`,
            borderRadius: '14px', textAlign: 'center', color: 'white',
          }}
        >
          <span style={{ fontSize: '28px' }}>{currentChapter.completionEmoji}</span>
          <p style={{
            margin: '8px 0 0', fontSize: '14px', fontFamily: "'Fredoka', sans-serif",
            fontWeight: '600',
          }}>
            {currentChapter.completionText}
          </p>
        </motion.div>
      )}

      {/* Событие */}
      <AnimatePresence>
        {showEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
              padding: '12px 20px', background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
              color: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center',
              gap: '10px', boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
              zIndex: 2500, fontFamily: "'Fredoka', sans-serif", fontSize: '14px',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '20px' }}>{showEvent.icon}</span>
            {showEvent.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Уведомление о новой главе */}
      <AnimatePresence>
        {showChapterUnlock && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              padding: '24px 32px', background: 'linear-gradient(135deg, #F97316, #FB923C)',
              color: 'white', borderRadius: '20px', textAlign: 'center',
              boxShadow: '0 12px 40px rgba(249, 115, 22, 0.5)',
              zIndex: 5000, fontFamily: "'Fredoka', sans-serif",
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
              style={{ fontSize: '48px', marginBottom: '8px' }}
            >
              {showChapterUnlock.icon}
            </motion.div>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Новая глава открыта!</p>
            <p style={{ margin: '4px 0 0', fontSize: '22px', fontWeight: '700' }}>
              Глава {showChapterUnlock.id}: {showChapterUnlock.title}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.85 }}>
              {showChapterUnlock.subtitle}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
