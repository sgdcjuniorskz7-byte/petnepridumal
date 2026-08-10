import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ReactionGame({ onEnd }) {
  const [state, setState] = useState('idle');
  const [results, setResults] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const startTime = useRef(null);
  const timeoutRef = useRef(null);

  const startRound = () => {
    setState('waiting');
    const delay = 1500 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      startTime.current = Date.now();
      setState('ready');
    }, delay);
  };

  const handleTap = () => {
    if (state === 'waiting') {
      clearTimeout(timeoutRef.current);
      setResults(prev => [...prev, -1]);
      setState('idle');
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(r => r + 1);
          startRound();
        } else {
          setShowResult(true);
        }
      }, 800);
    } else if (state === 'ready') {
      const time = Date.now() - startTime.current;
      setResults(prev => [...prev, time]);
      setState('idle');
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(r => r + 1);
          startRound();
        } else {
          setShowResult(true);
        }
      }, 500);
    }
  };

  const startGame = () => { setResults([]); setCurrentRound(0); setShowResult(false); setState('idle'); startRound(); };

  const avgTime = results.filter(r => r > 0).length > 0
    ? Math.round(results.filter(r => r > 0).reduce((a, b) => a + b, 0) / results.filter(r => r > 0).length)
    : 0;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
        padding: '20px', background: 'white', borderRadius: '24px',
        boxShadow: '8px 8px 16px #d4d4d4, -8px -8px 16px #ffffff' }}>
      <h3 style={{ margin: 0, fontSize: '20px', fontFamily: "'Fredoka', sans-serif" }}>⚡ Реакция!</h3>

      {state === 'idle' && !showResult && (
        <motion.button onClick={currentRound === 0 && results.length === 0 ? startGame : startRound}
          whileTap={{ scale: 0.95 }}
          style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            color: 'white', borderRadius: '14px', border: 'none', cursor: 'pointer',
            fontFamily: "'Fredoka', sans-serif", fontSize: '16px', fontWeight: '600' }}>
          {currentRound === 0 && results.length === 0 ? '🎮 Начать' : '➡️ Следующий'}
        </motion.button>
      )}

      {state !== 'idle' && !showResult && (
        <motion.button onClick={handleTap} animate={state === 'ready' ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.3, repeat: state === 'ready' ? Infinity : 0 }}
          style={{ width: '200px', height: '200px', borderRadius: '50%', border: 'none', cursor: 'pointer',
            fontSize: '16px', fontFamily: "'Fredoka', sans-serif", fontWeight: '600', color: 'white',
            background: state === 'waiting'
              ? 'linear-gradient(135deg, #EF4444, #DC2626)'
              : 'linear-gradient(135deg, #22C55E, #16A34A)',
            boxShadow: state === 'waiting'
              ? '0 8px 24px rgba(239, 68, 68, 0.5)'
              : '0 8px 24px rgba(34, 197, 94, 0.5)' }}>
          {state === 'waiting' ? '⚠️ Жди...' : '👆 Жми!'}
        </motion.button>
      )}

      {state === 'idle' && results.length > 0 && !showResult && (
        <div style={{ display: 'flex', gap: '6px' }}>
          {results.map((r, i) => (
            <span key={i} style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '12px',
              fontFamily: "'Fredoka', sans-serif", background: r < 0 ? '#FEE2E2' : r < 300 ? '#DCFCE7' : '#FEF3C7',
              color: r < 0 ? '#DC2626' : r < 300 ? '#16A34A' : '#92400E' }}>
              {r < 0 ? 'Слишком рано!' : `${r}мс`}
            </span>
          ))}
        </div>
      )}

      {showResult && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '48px' }}>{avgTime < 250 ? '🏆' : avgTime < 400 ? '🥇' : '🎖️'}</span>
          <p style={{ margin: 0, fontSize: '24px', fontFamily: "'Fredoka', sans-serif" }}>{avgTime}мс</p>
          <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>
            {avgTime < 200 ? 'Супер-скорость!' : avgTime < 300 ? 'Быстро!' : avgTime < 500 ? 'Нормально' : 'Можно лучше!'}
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <motion.button onClick={startGame} whileTap={{ scale: 0.95 }}
              style={{ padding: '12px 24px', background: '#F59E0B', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer', fontFamily: "'Fredoka', sans-serif" }}>🔄 Ещё</motion.button>
            <motion.button onClick={() => onEnd(Math.max(0, 10 - Math.floor(avgTime / 50)))} whileTap={{ scale: 0.95 }}
              style={{ padding: '12px 24px', background: '#F3F4F6', color: '#374151', borderRadius: '12px', border: '2px solid #E5E7EB', cursor: 'pointer', fontFamily: "'Fredoka', sans-serif" }}>🚪 Выйти</motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
