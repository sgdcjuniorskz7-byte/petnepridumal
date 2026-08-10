import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { id: 'profile', icon: '👤', label: 'Профиль' },
  { id: 'settings', icon: '⚙️', label: 'Настройки' },
  { id: 'help', icon: '❓', label: 'Помощь' },
];

export default function Menu({ isOpen, onClose, onSelect, petConfig, state, progress }) {
  const breed = petConfig?.breed || petConfig?.breedId
    ? (petConfig.breed || { name: 'Питомец', emoji: '🐾' })
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
              zIndex: 4000,
            }}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0,
              width: '280px', background: 'white',
              boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
              zIndex: 5000, display: 'flex', flexDirection: 'column',
              fontFamily: "'Fredoka', sans-serif",
            }}
          >
            <div style={{
              padding: '24px 20px', background: 'linear-gradient(135deg, #F97316, #FB923C)',
              color: 'white', borderRadius: '0 0 24px 0',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '32px',
                margin: '0 auto 12px',
              }}>
                {breed?.emoji || '🐾'}
              </div>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', textAlign: 'center' }}>
                {state?.name || 'Питомец'}
              </p>
              {breed && (
                <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.85, textAlign: 'center' }}>
                  {breed.name}
                </p>
              )}
              <div style={{
                display: 'flex', justifyContent: 'center', gap: '16px',
                marginTop: '12px', fontSize: '13px',
              }}>
                <span>⭐ Ур. {progress?.level || 1}</span>
                <span>🪙 {progress?.coins || 0}</span>
              </div>
            </div>

            <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {menuItems.map(item => (
                <motion.button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  whileHover={{ x: 4, background: '#FFF7ED' }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '14px 16px', border: 'none', background: 'transparent',
                    borderRadius: '14px', cursor: 'pointer', width: '100%',
                    fontFamily: "'Fredoka', sans-serif", fontSize: '15px',
                    color: '#374151', fontWeight: '500',
                  }}
                >
                  <span style={{ fontSize: '20px', minWidth: '28px', textAlign: 'center' }}>{item.icon}</span>
                  {item.label}
                </motion.button>
              ))}
            </nav>

            <div style={{ padding: '12px 20px 20px', borderTop: '1px solid #F3F4F6' }}>
              <motion.button
                onClick={() => onSelect('reset')}
                whileHover={{ background: '#FEF2F2' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', border: '1px solid #FECACA',
                  background: '#FEF2F2', borderRadius: '14px', cursor: 'pointer',
                  width: '100%', fontFamily: "'Fredoka', sans-serif", fontSize: '15px',
                  color: '#DC2626', fontWeight: '500',
                }}
              >
                <span style={{ fontSize: '20px', minWidth: '28px', textAlign: 'center' }}>🗑️</span>
                Новый питомец
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
