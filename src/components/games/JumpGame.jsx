import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const GAME_WIDTH = 300;
const GAME_HEIGHT = 400;
const GRAVITY = 0.8;
const JUMP_FORCE = -12;
const OBSTACLE_WIDTH = 30;
const OBSTACLE_GAP = 150;

export default function JumpGame({ onEnd }) {
  const [playerY, setPlayerY] = useState(GAME_HEIGHT - 50);
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isGrounded, setIsGrounded] = useState(true);
  const gameRef = useRef(null);
  const frameRef = useRef(null);
  const playerYRef = useRef(GAME_HEIGHT - 50);
  const velocityRef = useRef(0);
  const obstaclesRef = useRef([]);
  const scoreRef = useRef(0);
  const isPlayingRef = useRef(false);

  const jump = useCallback(() => {
    if (!isPlayingRef.current) return;
    if (playerYRef.current >= GAME_HEIGHT - 50) {
      velocityRef.current = JUMP_FORCE;
      setIsGrounded(false);
    }
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [jump]);

  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = setInterval(() => {
      // Physics
      velocityRef.current += GRAVITY;
      playerYRef.current += velocityRef.current;

      if (playerYRef.current >= GAME_HEIGHT - 50) {
        playerYRef.current = GAME_HEIGHT - 50;
        velocityRef.current = 0;
        setIsGrounded(true);
      }

      // Obstacles
      const lastObs = obstaclesRef.current[obstaclesRef.current.length - 1];
      if (!lastObs || lastObs.x < GAME_WIDTH - OBSTACLE_GAP) {
        const h = 40 + Math.random() * 80;
        obstaclesRef.current = [...obstaclesRef.current, {
          x: GAME_WIDTH,
          h,
          passed: false,
        }];
      }

      obstaclesRef.current = obstaclesRef.current
        .map(obs => ({ ...obs, x: obs.x - 3 }))
        .filter(obs => obs.x > -OBSTACLE_WIDTH);

      // Collision
      const px = 50;
      const py = playerYRef.current;
      const pw = 30;
      const ph = 30;

      for (const obs of obstaclesRef.current) {
        if (
          px + pw > obs.x && px < obs.x + OBSTACLE_WIDTH &&
          (py + ph > GAME_HEIGHT - obs.h || py < GAME_HEIGHT - obs.h - 60)
        ) {
          isPlayingRef.current = false;
          setIsPlaying(false);
          setShowResult(true);
          return;
        }

        if (!obs.passed && obs.x + OBSTACLE_WIDTH < px) {
          obs.passed = true;
          scoreRef.current += 1;
          setScore(scoreRef.current);
        }
      }

      setPlayerY(playerYRef.current);
      setObstacles([...obstaclesRef.current]);
    }, 20);

    return () => clearInterval(gameLoop);
  }, [isPlaying]);

  const startGame = () => {
    playerYRef.current = GAME_HEIGHT - 50;
    velocityRef.current = 0;
    obstaclesRef.current = [];
    scoreRef.current = 0;
    setPlayerY(GAME_HEIGHT - 50);
    setVelocity(0);
    setObstacles([]);
    setScore(0);
    setIsPlaying(true);
    setShowResult(false);
    setIsGrounded(true);
    isPlayingRef.current = true;
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
        padding: '20px', background: 'white', borderRadius: '24px',
        boxShadow: '8px 8px 16px #d4d4d4, -8px -8px 16px #ffffff' }}>
      <h3 style={{ margin: 0, fontSize: '20px', fontFamily: "'Fredoka', sans-serif" }}>🏃 Прыжки!</h3>

      {!isPlaying && !showResult && (
        <motion.button onClick={startGame} whileTap={{ scale: 0.95 }}
          style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
            color: 'white', borderRadius: '14px', border: 'none', cursor: 'pointer',
            fontFamily: "'Fredoka', sans-serif", fontSize: '16px', fontWeight: '600' }}>🎮 Начать</motion.button>
      )}

      {isPlaying && (
        <>
          <span style={{ fontSize: '14px', fontFamily: "'Fredoka', sans-serif", color: '#14B8A6' }}>
            🏆 {score} · Пробел/↑ — прыжок
          </span>
          <div ref={gameRef} onClick={jump}
            style={{ width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px`,
              background: 'linear-gradient(180deg, #87CEEB 0%, #90EE90 70%, #228B22 100%)',
              borderRadius: '16px', position: 'relative', overflow: 'hidden', cursor: 'pointer',
              border: '3px solid #E5E7EB' }}>
            {/* Player */}
            <div style={{ position: 'absolute', left: '50px', top: `${playerY}px`,
              width: '30px', height: '30px', fontSize: '24px', transition: 'none',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
              🐕
            </div>

            {/* Obstacles */}
            {obstacles.map((obs, i) => (
              <div key={i}>
                <div style={{ position: 'absolute', left: `${obs.x}px`, bottom: 0,
                  width: `${OBSTACLE_WIDTH}px`, height: `${obs.h}px`,
                  background: 'linear-gradient(180deg, #8B4513, #654321)',
                  borderRadius: '4px 4px 0 0',
                  boxShadow: '0 -2px 8px rgba(139, 69, 19, 0.5)' }} />
                <div style={{ position: 'absolute', left: `${obs.x}px`, top: 0,
                  width: `${OBSTACLE_WIDTH}px`, height: `${GAME_HEIGHT - obs.h - 60}px` }} />
              </div>
            ))}

            {/* Ground */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '20px',
              background: 'linear-gradient(180deg, #228B22, #006400)', borderRadius: '0 0 13px 13px' }} />
          </div>
        </>
      )}

      {showResult && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '48px' }}>{score >= 20 ? '🏆' : score >= 10 ? '🥇' : '🎖️'}</span>
          <p style={{ margin: 0, fontSize: '24px', fontFamily: "'Fredoka', sans-serif" }}>{score} прыжков</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <motion.button onClick={startGame} whileTap={{ scale: 0.95 }}
              style={{ padding: '12px 24px', background: '#14B8A6', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer', fontFamily: "'Fredoka', sans-serif" }}>🔄 Ещё</motion.button>
            <motion.button onClick={() => onEnd(score)} whileTap={{ scale: 0.95 }}
              style={{ padding: '12px 24px', background: '#F3F4F6', color: '#374151', borderRadius: '12px', border: '2px solid #E5E7EB', cursor: 'pointer', fontFamily: "'Fredoka', sans-serif" }}>🚪 Выйти</motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
