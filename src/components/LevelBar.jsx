import { motion } from 'framer-motion';
import { levelThresholds } from '../data/achievements';

function getXpForCurrentLevel(level) {
  const current = levelThresholds.find(t => t.level === level);
  return current ? current.xpRequired : 0;
}

function getXpForNextLevel(level) {
  const next = levelThresholds.find(t => t.level === level + 1);
  return next ? next.xpRequired : Infinity;
}

export default function LevelBar({ level, xp, coins, progressToNext }) {
  const currentXp = xp - getXpForCurrentLevel(level);
  const requiredXp = getXpForNextLevel(level) - getXpForCurrentLevel(level);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '14px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '8px 8px 16px #d4d4d4, -8px -8px 16px #ffffff',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #F97316, #FB923C)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: '700',
              color: 'white',
              fontFamily: "'Fredoka', sans-serif",
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)',
            }}
          >
            {level}
          </motion.div>
          <div>
            <p style={{
              margin: '0',
              fontSize: '12px',
              fontFamily: "'Fredoka', sans-serif",
              color: '#374151',
              fontWeight: '600',
            }}>
              Уровень {level}
            </p>
            <p style={{
              margin: '0',
              fontSize: '10px',
              color: '#9CA3AF',
              fontFamily: "'Nunito', sans-serif",
            }}>
              {currentXp} / {requiredXp} XP
            </p>
          </div>
        </div>

        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 12px',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            borderRadius: '20px',
            boxShadow: '0 2px 8px rgba(255, 215, 0, 0.4)',
          }}
        >
          <span style={{ fontSize: '14px' }}>🪙</span>
          <span style={{
            fontSize: '14px',
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: '600',
            color: '#92400E',
          }}>
            {coins}
          </span>
        </motion.div>
      </div>

      <div style={{
        height: '10px',
        background: '#E5E7EB',
        borderRadius: '5px',
        overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressToNext}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #F97316, #FB923C)',
            borderRadius: '5px',
            position: 'relative',
          }}
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            }}
          />
        </motion.div>
      </div>

      <p style={{
        margin: '0',
        fontSize: '9px',
        color: '#9CA3AF',
        textAlign: 'center',
        fontFamily: "'Nunito', sans-serif",
      }}>
        {requiredXp === Infinity ? 'Максимальный уровень!' : `Ещё ${requiredXp - currentXp} XP до уровня ${level + 1}`}
      </p>
    </motion.div>
  );
}
