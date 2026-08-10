import { motion } from 'framer-motion';

const statConfig = [
  { key: 'hunger', label: 'Голод', icon: '🍖', color: '#F97316', desc: 'Покормить, Лакомство' },
  { key: 'thirst', label: 'Жажда', icon: '💧', color: '#0EA5E9', desc: 'Напоить' },
  { key: 'happiness', label: 'Счастье', icon: '😊', color: '#EAB308', desc: 'Погладить, Фото, Игры' },
  { key: 'energy', label: 'Энергия', icon: '⚡', color: '#22C55E', desc: 'Спать, Прогулка' },
  { key: 'hygiene', label: 'Гигиена', icon: '🫧', color: '#8B5CF6', desc: 'Помыть, Расчесать' },
  { key: 'mood', label: 'Настроение', icon: '❤️', color: '#EC4899', desc: 'Общее состояние' },
];

function StatBar({ stat, value, onInfo }) {
  const getBarColor = () => {
    if (value > 60) return stat.color;
    if (value > 30) return '#EAB308';
    return '#DC2626';
  };

  const getStatus = () => {
    if (value > 80) return 'Отлично';
    if (value > 60) return 'Хорошо';
    if (value > 40) return 'Нормально';
    if (value > 20) return 'Плохо';
    return 'Критично';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 12px',
        background: value < 30 ? 'rgba(220, 38, 38, 0.08)' : '#F9FAFB',
        borderRadius: '12px',
        border: value < 30 ? '1px solid rgba(220, 38, 38, 0.2)' : '1px solid transparent',
      }}
    >
      <span style={{ fontSize: '18px', minWidth: '24px' }}>{stat.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '4px',
          fontSize: '11px',
          fontFamily: "'Fredoka', sans-serif",
        }}>
          <span style={{ color: '#374151', fontWeight: '500' }}>{stat.label}</span>
          <span style={{ color: getBarColor(), fontWeight: '600' }}>
            {Math.round(value)}% · {getStatus()}
          </span>
        </div>
        <div style={{
          height: '8px',
          background: '#E5E7EB',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${getBarColor()}, ${getBarColor()}CC)`,
              borderRadius: '4px',
            }}
          />
        </div>
        <div style={{
          fontSize: '9px',
          color: '#9CA3AF',
          marginTop: '2px',
          fontFamily: "'Nunito', sans-serif",
        }}>
          {stat.desc}
        </div>
      </div>
    </motion.div>
  );
}

export default function Stats({ stats }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        padding: '14px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '8px 8px 16px #d4d4d4, -8px -8px 16px #ffffff',
      }}
    >
      <h3 style={{
        margin: '0 0 6px 0',
        fontSize: '14px',
        textAlign: 'center',
        fontFamily: "'Fredoka', sans-serif",
        color: '#374151',
      }}>
        📊 Статистика
      </h3>
      {statConfig.map(stat => (
        <StatBar
          key={stat.key}
          stat={stat}
          value={stats[stat.key]}
        />
      ))}
    </motion.div>
  );
}
