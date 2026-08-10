import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function TapGame({ onEnd }) {
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [scale, setScale] = useState(1);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { setIsPlaying(false); setShowResult(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const tap = () => {
    if (!isPlaying) return;
    setTaps(t => t + 1);
    setScale(1.15);
    setTimeout(() => setScale(1), 80);
  };

  const startGame = () => { setTaps(0); setTimeLeft(10); setIsPlaying(true); setShowResult(false); };

  const tps = timeLeft < 10 ? Math.round(taps / (10 - timeLeft)) : 0;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
        padding: '20px', background: 'white', borderRadius: '24px',
        boxShadow: '8px 8px 16px #d4d4d4, -8px -8px 16px #ffffff' }}>
      <h3 style={{ margin: 0, fontSize: '20px', fontFamily: "'Fredoka', sans-serif" }}>👆 Скорость нажатий!</h3>

      {!isPlaying && !showResult && (
        <motion.button onClick={startGame} whileTap={{ scale: 0.95 }}
          style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
            color: 'white', borderRadius: '14px', border: 'none', cursor: 'pointer',
            fontFamily: "'Fredoka', sans-serif", fontSize: '16px', fontWeight: '600' }}>🎮 Начать</motion.button>
      )}

      {isPlaying && (
        <>
          <span style={{ fontSize: '14px', fontFamily: "'Fredoka', sans-serif", color: '#F97316' }}>⏱️ {timeLeft}с</span>
          <motion.button onClick={tap} animate={{ scale }}
            style={{ width: '150px', height: '150px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
              border: 'none', cursor: 'pointer', color: 'white', fontSize: '48px',
              fontFamily: "'Fredoka', sans-serif", fontWeight: '700',
              boxShadow: '0 8px 24px rgba(14, 165, 233, 0.4)' }}>
            {taps}
          </motion.button>
          <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>Нажимай как можно быстрее!</p>
        </>
      )}

      {showResult && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '48px' }}>{tps >= 8 ? '🏆' : tps >= 5 ? '🥇' : '🎖️'}</span>
          <p style={{ margin: 0, fontSize: '24px', fontFamily: "'Fredoka', sans-serif" }}>{taps} нажатий</p>
          <p style={{ margin: 0, fontSize: '16px', color: '#6B7280' }}>{tps} нажатий/сек</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <motion.button onClick={startGame} whileTap={{ scale: 0.95 }}
              style={{ padding: '12px 24px', background: '#0EA5E9', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer', fontFamily: "'Fredoka', sans-serif" }}>🔄 Ещё</motion.button>
            <motion.button onClick={() => onEnd(tps)} whileTap={{ scale: 0.95 }}
              style={{ padding: '12px 24px', background: '#F3F4F6', color: '#374151', borderRadius: '12px', border: '2px solid #E5E7EB', cursor: 'pointer', fontFamily: "'Fredoka', sans-serif" }}>🚪 Выйти</motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
