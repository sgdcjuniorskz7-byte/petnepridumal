import { motion, AnimatePresence } from 'framer-motion';
import { achievements } from '../data/achievements';

function AchievementCard({ achievement, unlocked }) {
  return (
    <motion.div
      whileHover={{ scale: unlocked ? 1.02 : 1 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 12px',
        background: unlocked
          ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1))'
          : '#F9FAFB',
        borderRadius: '12px',
        border: unlocked
          ? '1px solid rgba(34, 197, 94, 0.3)'
          : '1px solid #E5E7EB',
        opacity: unlocked ? 1 : 0.6,
      }}
    >
      <div style={{
        width: '36px',
        height: '36px',
        background: unlocked
          ? 'linear-gradient(135deg, #22C55E, #16A34A)'
          : '#E5E7EB',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
      }}>
        {unlocked ? achievement.emoji : '🔒'}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{
          margin: '0',
          fontSize: '12px',
          fontFamily: "'Fredoka', sans-serif",
          color: unlocked ? '#15803D' : '#6B7280',
          fontWeight: '500',
        }}>
          {achievement.name}
        </p>
        <p style={{
          margin: '0',
          fontSize: '10px',
          color: '#9CA3AF',
          fontFamily: "'Nunito', sans-serif",
        }}>
          {achievement.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Achievements({ unlockedAchievements = [] }) {
  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievements.length;
  const percentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h3 style={{
          margin: '0',
          fontSize: '16px',
          fontFamily: "'Fredoka', sans-serif",
          color: '#374151',
        }}>
          🏆 Достижения
        </h3>
        <span style={{
          fontSize: '12px',
          fontFamily: "'Fredoka', sans-serif",
          color: '#9CA3AF',
        }}>
          {unlockedCount}/{totalCount} ({percentage}%)
        </span>
      </div>

      <div style={{
        height: '6px',
        background: '#E5E7EB',
        borderRadius: '3px',
        overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #22C55E, #16A34A)',
            borderRadius: '3px',
          }}
        />
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        maxHeight: '200px',
        overflowY: 'auto',
      }}>
        {achievements.map(achievement => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            unlocked={unlockedAchievements.includes(achievement.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}
