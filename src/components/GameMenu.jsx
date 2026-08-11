import { useState } from 'react';
import { motion } from 'framer-motion';
import CatchGame from './games/CatchGame';
import MemoryGame from './games/MemoryGame';
import WhackGame from './games/WhackGame';
import ColorGame from './games/ColorGame';
import TapGame from './games/TapGame';
import ReactionGame from './games/ReactionGame';
import JumpGame from './games/JumpGame';

const games = [
  { id: 'catch', name: 'Поймай мяч', emoji: '⚾', description: 'Лови мячи, зарабатывай очки', color: '#22C55E', component: CatchGame },
  { id: 'memory', name: 'Найди пары', emoji: '🧠', description: 'Найди все пары карточек', color: '#8B5CF6', component: MemoryGame },
  { id: 'whack', name: 'Ударь крота', emoji: '🔨', description: 'Бей кротов пока они вылезают', color: '#F97316', component: WhackGame },
  { id: 'color', name: 'Угадай цвет', emoji: '🎨', description: 'Найди нужный цвет', color: '#EC4899', component: ColorGame },
  { id: 'tap', name: 'Скорость', emoji: '👆', description: 'Жми кнопку как можно быстрее', color: '#0EA5E9', component: TapGame },
  { id: 'reaction', name: 'Реакция', emoji: '⚡', description: 'Проверь свою реакцию', color: '#F59E0B', component: ReactionGame },
  { id: 'jump', name: 'Прыжки', emoji: '🏃', description: 'Прыгай через препятствия', color: '#14B8A6', component: JumpGame },
];

export default function GameMenu({ onPlayGame }) {
  const [selectedGame, setSelectedGame] = useState(null);

  const handleGameEnd = (score) => {
    onPlayGame(selectedGame, score);
    setSelectedGame(null);
  };

  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    const GameComponent = game.component;
    return <GameComponent onEnd={handleGameEnd} />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px',
        background: 'white', borderRadius: '20px',
        boxShadow: '8px 8px 16px #d4d4d4, -8px -8px 16px #ffffff' }}>
      <h3 style={{ margin: 0, fontSize: '16px', textAlign: 'center', fontFamily: "'Fredoka', sans-serif" }}>
        🎮 Мини-игры
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
        {games.map(game => (
          <motion.button key={game.id} onClick={() => setSelectedGame(game.id)}
            whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              padding: '14px 8px', background: `linear-gradient(135deg, ${game.color}15, ${game.color}08)`,
              borderRadius: '14px', border: `2px solid ${game.color}30`, cursor: 'pointer' }}>
            <div style={{ width: '44px', height: '44px',
              background: `linear-gradient(135deg, ${game.color}, ${game.color}CC)`,
              borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', boxShadow: `0 4px 12px ${game.color}44` }}>
              {game.emoji}
            </div>
            <p style={{ margin: 0, fontSize: '12px', fontFamily: "'Fredoka', sans-serif", fontWeight: '600', color: '#374151' }}>
              {game.name}
            </p>
            <p style={{ margin: 0, fontSize: '10px', color: '#9CA3AF', fontFamily: "'Nunito', sans-serif", textAlign: 'center' }}>
              {game.description}
            </p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
