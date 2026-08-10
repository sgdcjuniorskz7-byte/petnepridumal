import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const emojis = ['🐕', '🐱', '🐰', '🐹', '🐢', '🦜', '🦊', '🐼'];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createBoard(size = 8) {
  const pairs = emojis.slice(0, size / 2);
  const cards = [...pairs, ...pairs].map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
  return shuffleArray(cards);
}

export default function MemoryGame({ onEnd }) {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (matches === emojis.length && isPlaying) {
      setIsPlaying(false);
      setShowResult(true);
    }
  }, [matches, isPlaying]);

  const startGame = () => {
    setCards(createBoard());
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setTimer(0);
    setIsPlaying(true);
    setShowResult(false);
  };

  const handleCardClick = useCallback((cardId) => {
    if (!isPlaying) return;
    if (flippedCards.length >= 2) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newCards = cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);

      if (newFlipped[0].emoji === newFlipped[1].emoji) {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.emoji === newFlipped[0].emoji
              ? { ...c, isMatched: true }
              : c
          ));
          setMatches(m => m + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newFlipped.find(f => f.id === c.id)
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [cards, flippedCards, isPlaying]);

  const endGame = () => {
    const score = Math.max(0, 100 - moves * 2 - Math.floor(timer / 5));
    onEnd(score);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        🧠 Найди пары
      </h3>

      {!isPlaying && !showResult && (
        <motion.button
          onClick={startGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
            color: 'white',
            borderRadius: '14px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: "'Fredoka', sans-serif",
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
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
            maxWidth: '320px',
            padding: '0 10px',
          }}>
            <span style={{
              fontSize: '14px',
              fontFamily: "'Fredoka', sans-serif",
              color: '#8B5CF6',
            }}>
              ⏱️ {formatTime(timer)}
            </span>
            <span style={{
              fontSize: '14px',
              fontFamily: "'Fredoka', sans-serif",
              color: '#F97316',
            }}>
              🔄 {moves} ходов
            </span>
            <span style={{
              fontSize: '14px',
              fontFamily: "'Fredoka', sans-serif",
              color: '#22C55E',
            }}>
              ✅ {matches}/{emojis.length}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            maxWidth: '320px',
          }}>
            {cards.map(card => (
              <motion.div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  rotateY: card.isFlipped || card.isMatched ? 180 : 0,
                }}
                transition={{ duration: 0.3 }}
                style={{
                  width: '70px',
                  height: '70px',
                  perspective: '1000px',
                  cursor: card.isFlipped || card.isMatched ? 'default' : 'pointer',
                }}
              >
                <motion.div
                  animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Back */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                  }}>
                    ❓
                  </div>

                  {/* Front */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: card.isMatched
                      ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                      : 'white',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    border: card.isMatched
                      ? '3px solid #15803D'
                      : '3px solid #E5E7EB',
                    boxShadow: card.isMatched
                      ? '0 4px 12px rgba(34, 197, 94, 0.4)'
                      : '0 2px 8px rgba(0,0,0,0.1)',
                  }}>
                    {card.emoji}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
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
            {moves <= 12 ? '🏆' : moves <= 16 ? '🥇' : moves <= 20 ? '🥈' : '🎖️'}
          </div>

          <p style={{
            margin: '0',
            fontSize: '24px',
            fontFamily: "'Fredoka', sans-serif",
            color: '#374151',
          }}>
            Победа!
          </p>

          <div style={{
            display: 'flex',
            gap: '20px',
            padding: '12px 20px',
            background: '#F9FAFB',
            borderRadius: '12px',
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0', fontSize: '20px', fontFamily: "'Fredoka', sans-serif", color: '#374151' }}>
                {formatTime(timer)}
              </p>
              <p style={{ margin: '0', fontSize: '10px', color: '#9CA3AF' }}>Время</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0', fontSize: '20px', fontFamily: "'Fredoka', sans-serif", color: '#374151' }}>
                {moves}
              </p>
              <p style={{ margin: '0', fontSize: '10px', color: '#9CA3AF' }}>Ходов</p>
            </div>
          </div>

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
                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
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
