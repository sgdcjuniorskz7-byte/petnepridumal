import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const COLORS = [
  { hex: '#EF4444', name: 'Красный' },
  { hex: '#22C55E', name: 'Зелёный' },
  { hex: '#3B82F6', name: 'Синий' },
  { hex: '#EAB308', name: 'Жёлтый' },
  { hex: '#8B5CF6', name: 'Фиолетовый' },
  { hex: '#EC4899', name: 'Розовый' },
  { hex: '#F97316', name: 'Оранжевый' },
  { hex: '#14B8A6', name: 'Бирюзовый' },
];

function getRandomColor() { return COLORS[Math.floor(Math.random() * COLORS.length)]; }

export default function ColorGame({ onEnd }) {
  const [targetColor, setTargetColor] = useState('');
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [totalRounds] = useState(15);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const newRound = () => {
    const correct = getRandomColor();
    const wrongs = COLORS.filter(c => c.hex !== correct.hex).sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [...wrongs, correct].sort(() => Math.random() - 0.5);
    setTargetColor(correct);
    setOptions(opts);
  };

  const startGame = () => { setScore(0); setRound(0); setShowResult(false); newRound(); };

  useEffect(() => { if (round >= totalRounds && round > 0) setShowResult(true); }, [round]);

  const pick = (color) => {
    if (showResult) return;
    if (color.hex === targetColor.hex) {
      setScore(s => s + 1);
      setFeedback(true);
    } else {
      setFeedback(false);
    }
    setTimeout(() => { setFeedback(null); setRound(r => r + 1); newRound(); }, 400);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
        padding: '20px', background: 'white', borderRadius: '24px',
        boxShadow: '8px 8px 16px #d4d4d4, -8px -8px 16px #ffffff' }}>
      <h3 style={{ margin: 0, fontSize: '20px', fontFamily: "'Fredoka', sans-serif" }}>🎨 Угадай цвет!</h3>

      {round === 0 && !showResult && (
        <motion.button onClick={startGame} whileTap={{ scale: 0.95 }}
          style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #EC4899, #DB2777)',
            color: 'white', borderRadius: '14px', border: 'none', cursor: 'pointer',
            fontFamily: "'Fredoka', sans-serif", fontSize: '16px', fontWeight: '600' }}>🎮 Начать</motion.button>
      )}

      {round > 0 && !showResult && (
        <>
          <span style={{ fontSize: '14px', fontFamily: "'Fredoka', sans-serif", color: '#6B7280' }}>
            Раунд {round}/{totalRounds} · 🏆 {score}
          </span>
          <p style={{ margin: 0, fontSize: '16px', fontFamily: "'Fredoka', sans-serif", color: '#374151' }}>
            Какой это цвет?
          </p>
          <motion.div animate={feedback === true ? { scale: [1, 1.1, 1] } : feedback === false ? { x: [-5, 5, -5, 5, 0] } : {}}
            style={{ width: '120px', height: '120px', borderRadius: '20px', background: targetColor.hex,
              boxShadow: `0 8px 24px ${targetColor.hex}66`, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {options.map(color => (
              <motion.button key={color.hex} onClick={() => pick(color)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  padding: '10px', borderRadius: '12px', border: '3px solid white',
                  background: color.hex, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                <span style={{ fontSize: '14px', fontFamily: "'Fredoka', sans-serif", color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                  {color.name}
                </span>
              </motion.button>
            ))}
          </div>
        </>
      )}

      {showResult && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '48px' }}>{score >= 12 ? '🏆' : score >= 8 ? '🥇' : '🎖️'}</span>
          <p style={{ margin: 0, fontSize: '24px', fontFamily: "'Fredoka', sans-serif" }}>{score}/{totalRounds}</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <motion.button onClick={startGame} whileTap={{ scale: 0.95 }}
              style={{ padding: '12px 24px', background: '#EC4899', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer', fontFamily: "'Fredoka', sans-serif" }}>🔄 Ещё</motion.button>
            <motion.button onClick={() => onEnd(score)} whileTap={{ scale: 0.95 }}
              style={{ padding: '12px 24px', background: '#F3F4F6', color: '#374151', borderRadius: '12px', border: '2px solid #E5E7EB', cursor: 'pointer', fontFamily: "'Fredoka', sans-serif" }}>🚪 Выйти</motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
