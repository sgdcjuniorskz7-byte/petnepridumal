import { motion } from 'framer-motion';
import { useState } from 'react';

const actions = [
  { id: 'feed', label: 'Покормить', icon: '🍖', color: '#F97316' },
  { id: 'treat', label: 'Лакомство', icon: '🦴', color: '#D97706' },
  { id: 'water', label: 'Напоить', icon: '💧', color: '#0EA5E9' },
  { id: 'pet', label: 'Погладить', icon: '🤚', color: '#EAB308' },
  { id: 'brush', label: 'Расчесать', icon: '🪮', color: '#A855F7' },
  { id: 'wash', label: 'Помыть', icon: '🛁', color: '#2563EB' },
  { id: 'play', label: 'Поиграть', icon: '⚽', color: '#22C55E' },
  { id: 'walk', label: 'Прогулка', icon: '🌳', color: '#16A34A' },
  { id: 'photo', label: 'Фото', icon: '📸', color: '#EC4899' },
  { id: 'sleep', label: 'Спать', icon: '😴', color: '#8B5CF6' },
  { id: 'explore', label: 'Исследовать', icon: '🔍', color: '#0EA5E9' },
];

const tricks = [
  { id: 'sit', label: 'Сидеть', icon: '🐕' },
  { id: 'paw', label: 'Лапу', icon: '🐾' },
  { id: 'speak', label: 'Голос', icon: '🔊' },
  { id: 'down', label: 'Лежать', icon: '⬇️' },
  { id: 'roll', label: 'Кувырок', icon: '🔄' },
  { id: 'spin', label: 'Кружиться', icon: '🌀' },
  { id: 'jump', label: 'Прыгать', icon: '⬆️' },
  { id: 'fetch', label: 'Апорт', icon: '🦴' },
  { id: 'playdead', label: 'Умер', icon: '💀' },
  { id: 'slippers', label: 'Тапочки', icon: '🩴' },
];

export default function Controls({ onAction, onTrick, learnedTricks = [] }) {
  const [activeTrick, setActiveTrick] = useState(null);
  const [activeAction, setActiveAction] = useState(null);

  const handleTrickClick = (trickId) => {
    setActiveTrick(trickId);
    onTrick(trickId);
    setTimeout(() => setActiveTrick(null), 600);
  };

  const handleActionClick = (actionId) => {
    setActiveAction(actionId);
    onAction(actionId);
    setTimeout(() => setActiveAction(null), 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '8px 8px 16px #d4d4d4, -8px -8px 16px #ffffff',
      }}
    >
      <h3 style={{ margin: '0', fontSize: '16px', textAlign: 'center', fontFamily: "'Fredoka', sans-serif" }}>
        Действия
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
        {actions.map(action => {
          const isActive = activeAction === action.id;
          return (
            <motion.button
              key={action.id}
              onClick={() => handleActionClick(action.id)}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.88 }}
              animate={isActive ? { scale: [1, 1.15, 1], rotate: [0, -3, 3, 0] } : {}}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                padding: '10px 4px',
                background: isActive
                  ? `linear-gradient(135deg, ${action.color}, ${action.color}DD)`
                  : action.color,
                color: 'white',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '9px',
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: '500',
                boxShadow: isActive
                  ? `0 6px 20px ${action.color}88`
                  : `0 3px 0 ${action.color}88, 0 4px 8px rgba(0,0,0,0.12)`,
              }}
            >
              <motion.span
                style={{ fontSize: '18px' }}
                animate={isActive ? { scale: [1, 1.4, 1], rotate: [0, 10, -10, 0] } : {}}
              >
                {action.icon}
              </motion.span>
              <span>{action.label}</span>
            </motion.button>
          );
        })}
      </div>

      <div style={{ borderTop: '2px solid var(--color-border)', paddingTop: '12px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', textAlign: 'center', fontFamily: "'Fredoka', sans-serif" }}>
          🎓 Обучение командам
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px' }}>
          {tricks.map(trick => {
            const isLearned = learnedTricks.includes(trick.id);
            const isActive = activeTrick === trick.id;
            return (
              <motion.button
                key={trick.id}
                onClick={() => handleTrickClick(trick.id)}
                whileHover={{ scale: isLearned ? 1.08 : 1.1 }}
                whileTap={{ scale: 0.88 }}
                animate={isActive ? { scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] } : {}}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  padding: '8px 2px',
                  background: isLearned
                    ? isActive
                      ? 'linear-gradient(135deg, #F97316, #EA580C)'
                      : 'linear-gradient(135deg, #22C55E, #16A34A)'
                    : isActive
                    ? 'linear-gradient(135deg, #F97316, #FB923C)'
                    : '#F3F4F6',
                  color: isLearned || isActive ? 'white' : '#374151',
                  borderRadius: '10px',
                  border: isLearned ? '2px solid #15803D' : '2px solid #E5E7EB',
                  cursor: 'pointer',
                  fontSize: '8px',
                  fontFamily: "'Fredoka', sans-serif",
                  fontWeight: '500',
                  boxShadow: isActive
                    ? '0 4px 12px rgba(249, 115, 22, 0.5)'
                    : isLearned
                    ? '0 2px 6px rgba(34,197,94,0.3)'
                    : '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <motion.span
                  style={{ fontSize: '16px' }}
                  animate={isActive ? { scale: [1, 1.3, 1] } : {}}
                >
                  {isLearned ? '✅' : trick.icon}
                </motion.span>
                <span>{trick.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
