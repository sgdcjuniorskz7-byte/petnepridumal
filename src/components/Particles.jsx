import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

let particleId = 0;

function createParticle(type) {
  particleId++;
  return {
    id: particleId,
    type,
    x: 25 + Math.random() * 50,
    y: 35 + Math.random() * 25,
  };
}

const particleEmojis = {
  heart: ['❤️', '💕', '💖', '💗', '💓', '💝'],
  spark: ['✨', '⭐', '🌟', '💫', '🎇', '🎆'],
  zzz: ['💤', 'z', 'Z', '💤'],
  food: ['🍖', '🥩', '🍗', '🦴', '🥓', '🌭'],
  star: ['⭐', '🌟', '✨', '🎖️', '🏆', '💎'],
  water: ['💧', '💦', '🌊', '🫧'],
  brush: ['✨', '💫', '🌟'],
  leaf: ['🍃', '🌿', '☘️', '🍀'],
  flower: ['🌸', '🌺', '🌷', '🌻', '💐'],
  music: ['🎵', '🎶', '🎼', '🎤'],
};

export default function Particles({ particles }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 1000,
    }}>
      <AnimatePresence>
        {particles.map(particle => {
          const emojis = particleEmojis[particle.type] || particleEmojis.heart;
          const emoji = emojis[Math.floor(Math.random() * emojis.length)];

          return (
            <motion.div
              key={particle.id}
              initial={{
                opacity: 1,
                y: `${particle.y}%`,
                x: `${particle.x}%`,
                scale: 0.3,
              }}
              animate={{
                opacity: [1, 1, 0],
                y: [`${particle.y}%`, `${particle.y - 30}%`, `${particle.y - 55}%`],
                x: [`${particle.x}%`, `${particle.x + (Math.random() - 0.5) * 25}%`],
                scale: [0.3, 1.3, 0.7],
                rotate: [0, Math.random() > 0.5 ? 180 : -180],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                fontSize: '26px',
                userSelect: 'none',
              }}
            >
              {emoji}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export function useParticles() {
  const [particles, setParticles] = useState([]);

  const addParticles = useCallback((type, count = 5) => {
    const newParticles = Array.from({ length: count }, () => createParticle(type));
    setParticles(prev => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 2500);
  }, []);

  return { particles, addParticles };
}
