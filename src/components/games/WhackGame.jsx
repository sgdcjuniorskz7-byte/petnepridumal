import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GRID_SIZE = 9;

export default function WhackGame({ onEnd }) {
  const [moles, setMoles] = useState(Array(GRID_SIZE).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setMoles(prev => prev.map(() => Math.random() > 0.7));
    }, 600);
    return () => clearInterval(interval);
  }, [isPlaying]);

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

  const whack = (index) => {
    if (!isPlaying || !moles[index]) return;
    setMoles(prev => prev.map((m, i) => i === index ? false : m));
    setScore(s => s + 1);
  };

  const startGame = () => {
    setMoles(Array(GRID_SIZE).fill(false));
    setScore(0); setTimeLeft(20); setIsPlaying(true); setShowResult(false);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
        padding: '20px', background: 'white', borderRadius: '24px',
        boxShadow: '8px 8px 16px #d4d4d4, -8px -8px 16px #ffffff' }}>
      <h3 style={{ margin: 0, fontSize: '20px', fontFamily: "'Fredoka', sans-serif" }}>🔨 Ударь крота!</h3>

      {!isPlaying && !showResult && (
        <motion.button onClick={startGame} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #F97316, #EA580C)',
            color: 'white', borderRadius: '14px', border: 'none', cursor: 'pointer',
            fontFamily: "'Fredoka', sans-serif", fontSize: '16px', fontWeight: '600',
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)' }}>🎮 Начать</motion.button>
      )}

      {isPlaying && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontSize: '14px', fontFamily: "'Fredoka', sans-serif", color: '#F97316' }}>⏱️ {timeLeft}с</span>
            <span style={{ fontSize: '14px', fontFamily: "'Fredoka', sans-serif", color: '#22C55E' }}>🏆 {score}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {moles.map((up, i) => (
              <motion.button key={i} onClick={() => whack(i)} whileTap={{ scale: 0.85 }}
                style={{ width: '80px', height: '80px', borderRadius: '50%', border: 'none',
                  background: up ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' : '#E5E7EB',
                  cursor: up ? 'pointer' : 'default', fontSize: '36px',
                  boxShadow: up ? '0 4px 12px rgba(139, 92, 246, 0.5)' : 'none',
                  transition: 'background 0.15s' }}>
                {up ? '🐹' : '🕳️'}
              </motion.button>
            ))}
          </div>
        </>
      )}

      {showResult && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '48px' }}>{score >= 15 ? '🏆' : score >= 8 ? '🥇' : '🎖️'}</span>
          <p style={{ margin: 0, fontSize: '24px', fontFamily: "'Fredoka', sans-serif" }}>{score} ударов</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <motion.button onClick={startGame} whileTap={{ scale: 0.95 }}
              style={{ padding: '12px 24px', background: '#22C55E', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer', fontFamily: "'Fredoka', sans-serif" }}>🔄 Ещё</motion.button>
            <motion.button onClick={() => onEnd(score)} whileTap={{ scale: 0.95 }}
              style={{ padding: '12px 24px', background: '#F3F4F6', color: '#374151', borderRadius: '12px', border: '2px solid #E5E7EB', cursor: 'pointer', fontFamily: "'Fredoka', sans-serif" }}>🚪 Выйти</motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
