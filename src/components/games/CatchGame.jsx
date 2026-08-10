import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GAME_WIDTH = 300;
const GAME_HEIGHT = 400;
const BALL_SIZE = 30;
const CATCHER_WIDTH = 60;

function createBall() {
  return {
    id: Date.now() + Math.random(),
    x: Math.random() * (GAME_WIDTH - BALL_SIZE),
    y: -BALL_SIZE,
    speed: 2 + Math.random() * 3,
    type: Math.random() > 0.8 ? 'golden' : 'normal',
  };
}

export default function CatchGame({ onEnd }) {
  const [balls, setBalls] = useState([]);
  const [catcherX, setCatcherX] = useState(GAME_WIDTH / 2 - CATCHER_WIDTH / 2);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setBalls(prev => {
        const updated = prev
          .map(ball => ({ ...ball, y: ball.y + ball.speed }))
          .filter(ball => ball.y < GAME_HEIGHT + 50);

        if (Math.random() > 0.92) {
          updated.push(createBall());
        }

        return updated;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          setShowResult(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    const checkCollision = setInterval(() => {
      setBalls(prev => {
        const remaining = [];
        let caught = 0;

        prev.forEach(ball => {
          if (
            ball.y + BALL_SIZE > GAME_HEIGHT - 40 &&
            ball.y < GAME_HEIGHT - 10 &&
            ball.x + BALL_SIZE > catcherX &&
            ball.x < catcherX + CATCHER_WIDTH
          ) {
            caught += ball.type === 'golden' ? 5 : 1;
          } else {
            remaining.push(ball);
          }
        });

        if (caught > 0) {
          setScore(s => s + caught);
        }

        return remaining;
      });
    }, 50);

    return () => clearInterval(checkCollision);
  }, [catcherX, isPlaying]);

  const handleMouseMove = useCallback((e) => {
    if (!isPlaying) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - CATCHER_WIDTH / 2;
    setCatcherX(Math.max(0, Math.min(GAME_WIDTH - CATCHER_WIDTH, x)));
  }, [isPlaying]);

  const handleTouchMove = useCallback((e) => {
    if (!isPlaying) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left - CATCHER_WIDTH / 2;
    setCatcherX(Math.max(0, Math.min(GAME_WIDTH - CATCHER_WIDTH, x)));
  }, [isPlaying]);

  const startGame = () => {
    setBalls([]);
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setShowResult(false);
  };

  const endGame = () => {
    onEnd(score);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '20px',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '8px 8px 16px #d4d4d4, -8px -8px 16px #ffffff',
      }}
    >
      <h3 style={{
        margin: '0',
        fontSize: '20px',
        fontFamily: "'Fredoka', sans-serif",
        color: '#374151',
      }}>
        ⚾ Поймай мяч!
      </h3>

      {!isPlaying && !showResult && (
        <motion.button
          onClick={startGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #22C55E, #16A34A)',
            color: 'white',
            borderRadius: '14px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: "'Fredoka', sans-serif",
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
          }}
        >
          🎮 Начать игру
        </motion.button>
      )}

      {isPlaying && (
        <>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            padding: '0 10px',
          }}>
            <span style={{
              fontSize: '14px',
              fontFamily: "'Fredoka', sans-serif",
              color: '#F97316',
            }}>
              ⏱️ {timeLeft}с
            </span>
            <span style={{
              fontSize: '14px',
              fontFamily: "'Fredoka', sans-serif",
              color: '#22C55E',
            }}>
              🏆 {score} очков
            </span>
          </div>

          <div
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            style={{
              width: `${GAME_WIDTH}px`,
              height: `${GAME_HEIGHT}px`,
              background: 'linear-gradient(180deg, #87CEEB 0%, #90EE90 100%)',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'none',
              border: '3px solid #E5E7EB',
            }}
          >
            {balls.map(ball => (
              <motion.div
                key={ball.id}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  left: `${ball.x}px`,
                  top: `${ball.y}px`,
                  width: `${BALL_SIZE}px`,
                  height: `${BALL_SIZE}px`,
                  background: ball.type === 'golden'
                    ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                    : 'linear-gradient(135deg, #F97316, #EA580C)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  boxShadow: ball.type === 'golden'
                    ? '0 0 12px rgba(255, 215, 0, 0.6)'
                    : '0 2px 6px rgba(0,0,0,0.2)',
                }}
              >
                {ball.type === 'golden' ? '⭐' : '⚽'}
              </motion.div>
            ))}

            <motion.div
              animate={{ x: catcherX }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                position: 'absolute',
                bottom: '10px',
                width: `${CATCHER_WIDTH}px`,
                height: '30px',
                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                borderRadius: '8px 8px 16px 16px',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
              }}
            />
          </div>

          <p style={{
            margin: '0',
            fontSize: '11px',
            color: '#9CA3AF',
            fontFamily: "'Nunito', sans-serif",
          }}>
            Двигай мышкой или пальцем чтобы ловить мячи
          </p>
        </>
      )}

      {showResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{
            fontSize: '48px',
          }}>
            {score >= 50 ? '🏆' : score >= 30 ? '🥇' : score >= 15 ? '🥈' : '🎖️'}
          </div>

          <p style={{
            margin: '0',
            fontSize: '24px',
            fontFamily: "'Fredoka', sans-serif",
            color: '#374151',
          }}>
            {score} очков
          </p>

          <p style={{
            margin: '0',
            fontSize: '14px',
            color: '#6B7280',
            fontFamily: "'Nunito', sans-serif",
          }}>
            {score >= 50 ? 'Невероятно!' : score >= 30 ? 'Отлично!' : score >= 15 ? 'Хорошо!' : 'Попробуй ещё раз!'}
          </p>

          <div style={{
            display: 'flex',
            gap: '10px',
          }}>
            <motion.button
              onClick={startGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                color: 'white',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Fredoka', sans-serif",
                fontSize: '14px',
              }}
            >
              🔄 Ещё раз
            </motion.button>

            <motion.button
              onClick={endGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px 24px',
                background: '#F3F4F6',
                color: '#374151',
                borderRadius: '12px',
                border: '2px solid #E5E7EB',
                cursor: 'pointer',
                fontFamily: "'Fredoka', sans-serif",
                fontSize: '14px',
              }}
            >
              🚪 Выйти
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
