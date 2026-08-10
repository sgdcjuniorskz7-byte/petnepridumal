import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { breeds } from '../data/breeds';

const moodStates = {
  happy: { tailWag: true, mood: 'happy' },
  hungry: { tailWag: false, mood: 'hungry' },
  tired: { tailWag: false, mood: 'tired' },
  playing: { tailWag: true, mood: 'playing' },
  purring: { tailWag: 'slow', mood: 'purring' },
};

const actionLabels = {
  feed: '🍖 Ням-ням!',
  treat: '🦴 Вкусняшка!',
  water: '💧 Булдыж!',
  pet: '❤️ Муррр...',
  brush: '🪮 Причёска!',
  wash: '🛁 Буль-буль!',
  play: '⚽ Гуляем!',
  walk: '🌳 Прогулка!',
  photo: '📸 Сы Smile!',
  sleep: '😴 Зззз...',
  explore: '🔍 Исследуем!',
};

const trickLabels = {
  sit: '🪑 Сидеть!',
  paw: '🐾 Лапу!',
  speak: '🔊 Голос!',
  down: '⬇️ Лежать!',
  roll: '🔄 Кувырок!',
  spin: '🌀 Кружись!',
  jump: '⬆️ Прыг!',
  fetch: '🦴 Апорт!',
  playdead: '💀 Тыдох!',
  slippers: '🩴 Тапочки!',
};

function getMood(stats) {
  if (stats.energy < 30) return 'tired';
  if (stats.hunger < 30) return 'hungry';
  if (stats.happiness > 70) return 'happy';
  if (stats.mood > 60) return 'purring';
  return 'hungry';
}

// ===== SVG =====

function DogSVG({ primary, secondary, ear, mood, action, trick, tailAngle, scale }) {
  const isSleeping = action === 'sleep';
  const isPetting = action === 'pet';
  const isFeeding = action === 'feed';
  const isPlaying = action === 'play';
  const isWalking = action === 'walk';
  const isSitting = trick === 'sit';
  const isPaw = trick === 'paw';
  const isSpeak = trick === 'speak';
  const isDown = trick === 'down';
  const isRoll = trick === 'roll';
  const isLying = isDown || trick === 'playdead';
  const isClosed = isSleeping || isPetting || trick === 'playdead';

  return (
    <svg viewBox="0 0 200 220" width={200 * scale} height={220 * scale}>
      <motion.ellipse cx="100" cy="210" rx="50" ry="8" fill="rgba(0,0,0,0.1)"
        animate={isSitting ? { ry: 35, cy: 215 } : isLying ? { ry: 60, rx: 55 } : {}}
        transition={{ duration: 0.3 }} />
      <motion.path
        d={`M 150 120 Q ${170 + tailAngle} ${100 - tailAngle / 2} ${165 + tailAngle / 2} 80`}
        fill="none" stroke={primary} strokeWidth="8" strokeLinecap="round" />
      <motion.ellipse cx="100" cy="135" rx="55" ry="45" fill={primary}
        animate={isLying ? { cy: 165, ry: 25, rx: 60 } : isSitting ? { cy: 150, ry: 35 }
          : isFeeding ? { ry: [45, 42, 45, 42, 45] } : isSleeping ? { ry: 50, cy: 140 }
            : isPlaying ? { ry: [45, 40, 45] } : { cy: 135, ry: 45 }}
        transition={{ duration: isFeeding ? 0.8 : 0.4, repeat: isFeeding ? 2 : 0 }} />
      <motion.ellipse cx="100" cy="145" rx="35" ry="25" fill={secondary}
        animate={isLying ? { cy: 175, ry: 15 } : isSitting ? { cy: 160, ry: 20 }
          : isSleeping ? { cy: 155, ry: 30 } : { cy: 145, ry: 25 }}
        transition={{ duration: 0.3 }} />
      <motion.g animate={isLying ? { y: 25, scaleX: 1.2 } : isSitting ? { y: 15 }
        : isSleeping ? { y: 20, scaleY: 0.8 } : { y: 0 }}
        transition={{ duration: 0.3 }}>
        <rect x="60" y="160" width="14" height="35" rx="7" fill={primary} />
        <rect x="126" y="160" width="14" height="35" rx="7" fill={primary} />
        <ellipse cx="67" cy="198" rx="9" ry="5" fill={secondary} />
        <ellipse cx="133" cy="198" rx="9" ry="5" fill={secondary} />
      </motion.g>
      <motion.g animate={isLying ? { y: 30 } : isSitting ? { y: 15 }
        : isSleeping ? { y: 20 } : { y: 0 }}
        transition={{ duration: 0.3 }}>
        <rect x="72" y="160" width="14" height="35" rx="7" fill={primary} />
        <ellipse cx="79" cy="198" rx="9" ry="5" fill={secondary} />
        <motion.rect x="114" y="160" width="14" height="35" rx="7" fill={primary}
          animate={isPaw ? { y: 120, rotate: -30 } : isPetting ? { y: 150, rotate: -10 }
            : trick === 'slippers' ? { y: 140, rotate: -20 } : { y: 160, rotate: 0 }}
          style={{ transformOrigin: '121px 160px' }}
          transition={{ duration: 0.3, type: 'spring' }} />
        <motion.ellipse cx="121" cy="198" rx="9" ry="5" fill={secondary}
          animate={isPaw ? { cx: 105, cy: 140 } : isPetting ? { cx: 115, cy: 188 }
            : { cx: 121, cy: 198 }}
          transition={{ duration: 0.3, type: 'spring' }} />
      </motion.g>
      <motion.circle cx="100" cy="75" r="42" fill={primary}
        animate={isLying ? { cy: 100, r: 38 } : isSitting ? { cy: 85 }
          : isSleeping ? { cy: 95, rotate: 15 } : isFeeding ? { cy: [75, 78, 75] }
            : isPetting ? { rotate: [0, -5, 0], cy: 72 }
              : isPlaying ? { cy: [75, 72, 75] } : { cy: 75 }}
        transition={{ duration: 0.4, repeat: isFeeding ? 2 : 0 }} />
      <motion.ellipse cx="100" cy="82" rx="25" ry="20" fill={secondary}
        animate={isLying ? { cy: 107 } : isSitting ? { cy: 92 }
          : isSleeping ? { cy: 102, rotate: 15 } : { cy: 82 }}
        transition={{ duration: 0.3 }} />
      <motion.ellipse cx="62" cy="50" rx="14" ry="24" fill={ear}
        animate={{ rotate: isSleeping ? 25 : trick === 'playdead' ? 30 : mood === 'happy' ? -15 : mood === 'hungry' ? 15 : 10 }}
        style={{ transformOrigin: '62px 70px' }} transition={{ duration: 0.3 }} />
      <motion.ellipse cx="138" cy="50" rx="14" ry="24" fill={ear}
        animate={{ rotate: isSleeping ? -25 : trick === 'playdead' ? -30 : mood === 'happy' ? 15 : mood === 'hungry' ? -15 : -10 }}
        style={{ transformOrigin: '138px 70px' }} transition={{ duration: 0.3 }} />
      {!isClosed && (
        <motion.g animate={{ scaleY: mood === 'happy' ? 0.4 : mood === 'tired' ? 0.6 : 1 }}
          transition={{ duration: 0.3 }} style={{ transformOrigin: '100px 70px' }}>
          <circle cx="85" cy="70" r="7" fill="#1a1a1a" />
          <circle cx="115" cy="70" r="7" fill="#1a1a1a" />
          <circle cx="88" cy="67" r="2.5" fill="white" />
          <circle cx="118" cy="67" r="2.5" fill="white" />
        </motion.g>
      )}
      {isClosed && (
        <g>
          <path d="M 78 70 Q 85 76 92 70" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 108 70 Q 115 76 122 70" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}
      <ellipse cx="100" cy="85" rx="8" ry="5" fill="#1a1a1a" />
      <ellipse cx="100" cy="84" rx="3" ry="1.5" fill="#444" />
      {isSpeak ? (
        <motion.g animate={{ scaleY: [1, 1.5, 1] }} transition={{ duration: 0.3, repeat: 2 }}
          style={{ transformOrigin: '100px 95px' }}>
          <ellipse cx="100" cy="98" rx="12" ry="10" fill="#FF6B6B" stroke="#5D3A1A" strokeWidth="2" />
        </motion.g>
      ) : isFeeding ? (
        <motion.g animate={{ scaleY: [1, 0.8, 1, 0.8, 1] }} transition={{ duration: 0.3, repeat: 2 }}
          style={{ transformOrigin: '100px 95px' }}>
          <ellipse cx="100" cy="96" rx="8" ry="6" fill="#FF6B6B" stroke="#5D3A1A" strokeWidth="2" />
        </motion.g>
      ) : isSleeping || trick === 'playdead' ? (
        <path d="M 92 95 Q 100 98 108 95" fill="none" stroke="#5D3A1A" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <>
          {mood === 'happy' && <path d="M 88 93 Q 100 105 112 93" fill="none" stroke="#5D3A1A" strokeWidth="2" strokeLinecap="round" />}
          {mood === 'playing' && <path d="M 86 93 Q 100 110 114 93" fill="#FF6B6B" stroke="#5D3A1A" strokeWidth="2" strokeLinecap="round" />}
          {(mood === 'tired' || mood === 'hungry') && <line x1="92" y1="95" x2="108" y2="95" stroke="#5D3A1A" strokeWidth="2" strokeLinecap="round" />}
        </>
      )}
      <rect x="70" y="102" width="60" height="12" rx="6" fill="#DC2626" />
      <circle cx="100" cy="108" r="5" fill="#FFD700" />
    </svg>
  );
}

function CatSVG({ primary, secondary, mood, action, trick, scale }) {
  const isSleeping = action === 'sleep';
  const isPetting = action === 'pet';
  const isClosed = isSleeping || isPetting || trick === 'playdead';

  return (
    <svg viewBox="0 0 200 220" width={200 * scale} height={220 * scale}>
      <motion.ellipse cx="100" cy="210" rx="45" ry="7" fill="rgba(0,0,0,0.1)" />
      <motion.path d="M 155 140 Q 180 120 175 90 Q 170 70 180 60" fill="none"
        stroke={primary} strokeWidth="6" strokeLinecap="round"
        animate={{ d: mood === 'happy'
          ? "M 155 140 Q 185 125 178 95 Q 172 75 185 65"
          : "M 155 140 Q 175 115 172 88 Q 168 68 175 55" }}
        transition={{ duration: 1, repeat: mood === 'happy' ? Infinity : 0, repeatType: 'reverse' }} />
      <motion.ellipse cx="100" cy="140" rx="50" ry="40" fill={primary}
        animate={isSleeping ? { ry: 45, cy: 145 } : { ry: 40, cy: 140 }}
        transition={{ duration: 0.3 }} />
      <ellipse cx="100" cy="148" rx="30" ry="22" fill={secondary} />
      <rect x="62" y="165" width="12" height="30" rx="6" fill={primary} />
      <rect x="126" y="165" width="12" height="30" rx="6" fill={primary} />
      <ellipse cx="68" cy="196" rx="7" ry="4" fill={secondary} />
      <ellipse cx="132" cy="196" rx="7" ry="4" fill={secondary} />
      <rect x="75" y="165" width="12" height="30" rx="6" fill={primary} />
      <ellipse cx="81" cy="196" rx="7" ry="4" fill={secondary} />
      <motion.rect x="113" y="165" width="12" height="30" rx="6" fill={primary}
        animate={trick === 'paw' ? { y: 130, rotate: -25 } : { y: 165, rotate: 0 }}
        style={{ transformOrigin: '119px 165px' }}
        transition={{ duration: 0.3, type: 'spring' }} />
      <motion.circle cx="100" cy="75" r="38" fill={primary}
        animate={isSleeping ? { cy: 90, rotate: 10 } : isPetting ? { rotate: [0, -5, 0] } : { cy: 75 }}
        transition={{ duration: 0.4 }} />
      <ellipse cx="100" cy="80" rx="22" ry="16" fill={secondary} />
      <motion.polygon points="62,55 55,25 75,48" fill={primary}
        animate={{ rotate: isSleeping ? 10 : mood === 'happy' ? -5 : 0 }}
        style={{ transformOrigin: '65px 48px' }} transition={{ duration: 0.3 }} />
      <motion.polygon points="138,55 145,25 125,48" fill={primary}
        animate={{ rotate: isSleeping ? -10 : mood === 'happy' ? 5 : 0 }}
        style={{ transformOrigin: '135px 48px' }} transition={{ duration: 0.3 }} />
      <polygon points="64,50 58,30 73,47" fill="#FFB6C1" opacity="0.6" />
      <polygon points="136,50 142,30 127,47" fill="#FFB6C1" opacity="0.6" />
      {!isClosed && (
        <g>
          <ellipse cx="85" cy="72" rx="6" ry={mood === 'happy' ? 3 : 7} fill="#22C55E" />
          <ellipse cx="115" cy="72" rx="6" ry={mood === 'happy' ? 3 : 7} fill="#22C55E" />
          <ellipse cx="85" cy="72" rx="3" ry={mood === 'happy' ? 2 : 6} fill="#1a1a1a" />
          <ellipse cx="115" cy="72" rx="3" ry={mood === 'happy' ? 2 : 6} fill="#1a1a1a" />
          <circle cx="87" cy="69" r="1.5" fill="white" />
          <circle cx="117" cy="69" r="1.5" fill="white" />
        </g>
      )}
      {isClosed && (
        <g>
          <path d="M 78 72 Q 85 78 92 72" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
          <path d="M 108 72 Q 115 78 122 72" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
      <polygon points="100,82 96,86 104,86" fill="#FF6B9D" />
      <line x1="60" y1="82" x2="80" y2="85" stroke="#999" strokeWidth="1" />
      <line x1="58" y1="88" x2="78" y2="88" stroke="#999" strokeWidth="1" />
      <line x1="120" y1="85" x2="140" y2="82" stroke="#999" strokeWidth="1" />
      <line x1="122" y1="88" x2="142" y2="88" stroke="#999" strokeWidth="1" />
      {isClosed ? (
        <path d="M 95 90 Q 100 93 105 90" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path d="M 92 89 Q 100 96 108 89" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      )}
      {(mood === 'happy' || isPetting) && !isClosed && (
        <>
          <ellipse cx="72" cy="82" rx="5" ry="3" fill="rgba(255,150,150,0.5)" />
          <ellipse cx="128" cy="82" rx="5" ry="3" fill="rgba(255,150,150,0.5)" />
        </>
      )}
    </svg>
  );
}

function RabbitSVG({ primary, secondary, mood, action, trick, scale }) {
  const isSleeping = action === 'sleep';
  const isClosed = isSleeping || action === 'pet' || trick === 'playdead';

  return (
    <svg viewBox="0 0 200 220" width={200 * scale} height={220 * scale}>
      <motion.ellipse cx="100" cy="210" rx="40" ry="6" fill="rgba(0,0,0,0.1)" />
      <circle cx="148" cy="145" r="10" fill="white" />
      <motion.ellipse cx="100" cy="145" rx="45" ry="38" fill={primary}
        animate={isSleeping ? { ry: 42, cy: 148 } : { ry: 38, cy: 145 }}
        transition={{ duration: 0.3 }} />
      <ellipse cx="100" cy="152" rx="28" ry="20" fill={secondary} />
      <rect x="65" y="168" width="12" height="28" rx="6" fill={primary} />
      <rect x="123" y="168" width="12" height="28" rx="6" fill={primary} />
      <ellipse cx="71" cy="196" rx="8" ry="5" fill={secondary} />
      <ellipse cx="129" cy="196" rx="8" ry="5" fill={secondary} />
      <rect x="78" y="168" width="12" height="28" rx="6" fill={primary} />
      <rect x="110" y="168" width="12" height="28" rx="6" fill={primary} />
      <motion.circle cx="100" cy="80" r="35" fill={primary}
        animate={isSleeping ? { cy: 95 } : { cy: 80 }}
        transition={{ duration: 0.3 }} />
      <ellipse cx="100" cy="85" rx="20" ry="15" fill={secondary} />
      <motion.ellipse cx="78" cy="35" rx="10" ry="30" fill={primary}
        animate={isSleeping ? { rotate: -20 } : mood === 'happy' ? { rotate: [-5, 5, -5] } : { rotate: -5 }}
        style={{ transformOrigin: '78px 65px' }}
        transition={{ duration: mood === 'happy' ? 1 : 0.3, repeat: mood === 'happy' ? Infinity : 0 }} />
      <motion.ellipse cx="122" cy="35" rx="10" ry="30" fill={primary}
        animate={isSleeping ? { rotate: 20 } : mood === 'happy' ? { rotate: [5, -5, 5] } : { rotate: 5 }}
        style={{ transformOrigin: '122px 65px' }}
        transition={{ duration: mood === 'happy' ? 1 : 0.3, repeat: mood === 'happy' ? Infinity : 0 }} />
      <ellipse cx="78" cy="35" rx="6" ry="22" fill="#FFB6C1" opacity="0.5" />
      <ellipse cx="122" cy="35" rx="6" ry="22" fill="#FFB6C1" opacity="0.5" />
      {!isClosed && (
        <g>
          <circle cx="88" cy="76" r="5" fill="#1a1a1a" />
          <circle cx="112" cy="76" r="5" fill="#1a1a1a" />
          <circle cx="90" cy="74" r="2" fill="white" />
          <circle cx="114" cy="74" r="2" fill="white" />
        </g>
      )}
      {isClosed && (
        <g>
          <path d="M 82 76 Q 88 80 94 76" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
          <path d="M 106 76 Q 112 80 118 76" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
      <ellipse cx="100" cy="84" rx="4" ry="3" fill="#FF6B9D" />
      <path d="M 96 87 Q 100 92 104 87" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="97" y="87" width="6" height="5" rx="2" fill="white" stroke="#ddd" strokeWidth="0.5" />
      {(mood === 'happy' || action === 'pet') && (
        <>
          <ellipse cx="76" cy="84" rx="5" ry="3" fill="rgba(255,150,150,0.4)" />
          <ellipse cx="124" cy="84" rx="5" ry="3" fill="rgba(255,150,150,0.4)" />
        </>
      )}
    </svg>
  );
}

function HamsterSVG({ primary, secondary, mood, action, trick, scale }) {
  const isSleeping = action === 'sleep';
  const isClosed = isSleeping || action === 'pet' || trick === 'playdead';

  return (
    <svg viewBox="0 0 200 220" width={200 * scale} height={220 * scale}>
      <motion.ellipse cx="100" cy="210" rx="35" ry="5" fill="rgba(0,0,0,0.1)" />
      <motion.ellipse cx="100" cy="150" rx="48" ry="42" fill={primary}
        animate={isSleeping ? { ry: 46, cy: 152 } : { ry: 42, cy: 150 }}
        transition={{ duration: 0.3 }} />
      <ellipse cx="65" cy="145" rx="18" ry="15" fill={secondary} />
      <ellipse cx="135" cy="145" rx="18" ry="15" fill={secondary} />
      <ellipse cx="100" cy="155" rx="25" ry="22" fill={secondary} />
      <ellipse cx="75" cy="190" rx="10" ry="6" fill={primary} />
      <ellipse cx="125" cy="190" rx="10" ry="6" fill={primary} />
      <motion.circle cx="100" cy="85" r="35" fill={primary}
        animate={isSleeping ? { cy: 100 } : { cy: 85 }}
        transition={{ duration: 0.3 }} />
      <circle cx="68" cy="58" r="10" fill={primary} />
      <circle cx="132" cy="58" r="10" fill={primary} />
      <circle cx="68" cy="58" r="6" fill="#FFB6C1" opacity="0.6" />
      <circle cx="132" cy="58" r="6" fill="#FFB6C1" opacity="0.6" />
      {!isClosed && (
        <g>
          <circle cx="85" cy="80" r="5" fill="#1a1a1a" />
          <circle cx="115" cy="80" r="5" fill="#1a1a1a" />
          <circle cx="87" cy="78" r="2" fill="white" />
          <circle cx="117" cy="78" r="2" fill="white" />
        </g>
      )}
      {isClosed && (
        <g>
          <path d="M 79 80 Q 85 84 91 80" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
          <path d="M 109 80 Q 115 84 121 80" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
      <ellipse cx="100" cy="88" rx="4" ry="3" fill="#FF6B9D" />
      <path d="M 95 91 Q 100 95 105 91" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="60" y1="86" x2="78" y2="88" stroke="#ccc" strokeWidth="1" />
      <line x1="122" y1="88" x2="140" y2="86" stroke="#ccc" strokeWidth="1" />
      {(mood === 'happy' || action === 'pet') && (
        <>
          <ellipse cx="72" cy="88" rx="5" ry="3" fill="rgba(255,150,150,0.4)" />
          <ellipse cx="128" cy="88" rx="5" ry="3" fill="rgba(255,150,150,0.4)" />
        </>
      )}
    </svg>
  );
}

function TurtleSVG({ primary, secondary, mood, action, trick, scale }) {
  return (
    <svg viewBox="0 0 200 220" width={200 * scale} height={220 * scale}>
      <motion.ellipse cx="100" cy="210" rx="55" ry="7" fill="rgba(0,0,0,0.1)" />
      <path d="M 155 155 L 170 160 L 158 165" fill={primary} />
      <ellipse cx="60" cy="185" rx="14" ry="8" fill={primary} />
      <ellipse cx="140" cy="185" rx="14" ry="8" fill={primary} />
      <ellipse cx="65" cy="170" rx="10" ry="6" fill={primary} />
      <ellipse cx="135" cy="170" rx="10" ry="6" fill={primary} />
      <motion.ellipse cx="100" cy="140" rx="55" ry="40" fill="#5D8A3C"
        animate={action === 'sleep' ? { ry: 44 } : { ry: 40 }}
        transition={{ duration: 0.3 }} />
      <ellipse cx="100" cy="135" rx="35" ry="25" fill="#6B9E4A" />
      <path d="M 65 140 Q 80 120 100 115 Q 120 120 135 140" fill="none" stroke="#4A7A2E" strokeWidth="2" />
      <path d="M 70 150 Q 85 135 100 130 Q 115 135 130 150" fill="none" stroke="#4A7A2E" strokeWidth="2" />
      <motion.ellipse cx="50" cy="135" rx="18" ry="14" fill={primary}
        animate={action === 'pet' ? { rotate: [0, -5, 0] } : {}}
        style={{ transformOrigin: '50px 135px' }}
        transition={{ duration: 0.4 }} />
      <circle cx="42" cy="132" r="4" fill="#1a1a1a" />
      <circle cx="43" cy="131" r="1.5" fill="white" />
      <path d="M 38 140 Q 42 144 46 140" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ParrotSVG({ primary, secondary, mood, action, trick, scale }) {
  const isSleeping = action === 'sleep';
  const isClosed = isSleeping || action === 'pet';

  return (
    <svg viewBox="0 0 200 220" width={200 * scale} height={220 * scale}>
      <motion.ellipse cx="100" cy="210" rx="30" ry="5" fill="rgba(0,0,0,0.1)" />
      <path d="M 110 175 L 130 210 L 140 200 L 120 170" fill="#DC2626" />
      <path d="M 115 175 L 135 205 L 145 195 L 125 168" fill="#F97316" />
      <motion.ellipse cx="100" cy="145" rx="35" ry="38" fill={primary}
        animate={isSleeping ? { ry: 42 } : { ry: 38 }}
        transition={{ duration: 0.3 }} />
      <ellipse cx="100" cy="150" rx="22" ry="25" fill={secondary} />
      <motion.path d="M 130 120 Q 155 140 140 170 Q 130 160 125 140" fill="#22C55E"
        animate={action === 'play' ? { d: "M 130 120 Q 165 130 150 165 Q 135 155 125 135" } : {}}
        transition={{ duration: 0.3 }} />
      <line x1="88" y1="178" x2="85" y2="200" stroke="#666" strokeWidth="3" />
      <line x1="112" y1="178" x2="115" y2="200" stroke="#666" strokeWidth="3" />
      <path d="M 75 200 L 85 200 L 90 205" fill="none" stroke="#666" strokeWidth="2" />
      <path d="M 125 200 L 115 200 L 110 205" fill="none" stroke="#666" strokeWidth="2" />
      <motion.circle cx="100" cy="80" r="30" fill={primary}
        animate={action === 'pet' ? { rotate: [0, -5, 0] } : {}}
        style={{ transformOrigin: '100px 80px' }}
        transition={{ duration: 0.4 }} />
      <path d="M 90 55 Q 100 35 105 55" fill="#FFD700" />
      <path d="M 95 52 Q 102 38 108 52" fill="#F97316" />
      <circle cx="88" cy="78" r="10" fill="white" />
      <circle cx="112" cy="78" r="10" fill="white" />
      {!isClosed && (
        <>
          <circle cx="88" cy="78" r="5" fill="#1a1a1a" />
          <circle cx="90" cy="76" r="2" fill="white" />
          <circle cx="112" cy="78" r="5" fill="#1a1a1a" />
          <circle cx="114" cy="76" r="2" fill="white" />
        </>
      )}
      {isClosed && (
        <g>
          <path d="M 82 78 Q 88 82 94 78" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
          <path d="M 106 78 Q 112 82 118 78" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
      <path d="M 95 88 L 100 98 L 105 88" fill="#FFA500" stroke="#CC8400" strokeWidth="1" />
    </svg>
  );
}

// ===== ПЕРЕКЛЮЧАТЕЛЬ =====

function PetSVG({ breedId, ...props }) {
  switch (breedId) {
    case 'cat': return <CatSVG {...props} />;
    case 'rabbit': return <RabbitSVG {...props} />;
    case 'hamster': return <HamsterSVG {...props} />;
    case 'turtle': return <TurtleSVG {...props} />;
    case 'parrot': return <ParrotSVG {...props} />;
    default: return <DogSVG {...props} />;
  }
}

// ===== ОСНОВНОЙ КОМПОНЕНТ =====

export default function Dog({ stats, isAnimating, currentTrick, currentAction, onClick, petConfig }) {
  const mood = getMood(stats);
  const [tailAngle, setTailAngle] = useState(0);

  const breedId = petConfig?.breed?.id || petConfig?.breedId || 'dog';
  const breed = breeds.find(b => b.id === breedId);
  const primaryColor = petConfig?.color?.primary || '#D2691E';
  const secondaryColor = petConfig?.color?.secondary || '#DEB887';
  const earColor = petConfig?.color?.id === 'black' ? '#2a2a2a' : '#8B4513';
  const scale = petConfig?.size?.scale || 1.0;

  useEffect(() => {
    if (mood !== 'happy' && mood !== 'purring') return;
    const speed = mood === 'purring' ? 1000 : 300;
    const interval = setInterval(() => {
      setTailAngle(prev => (prev === 0 ? 15 : 0));
    }, speed);
    return () => clearInterval(interval);
  }, [mood]);

  const activeLabel = currentTrick
    ? trickLabels[currentTrick]
    : currentAction
    ? actionLabels[currentAction]
    : null;

  const warnings = [
    stats.hunger <= 0 && { icon: '🍖', label: 'Голоден!', color: '#DC2626', x: -70, y: 0 },
    stats.thirst <= 0 && { icon: '💧', label: 'Хочет пить!', color: '#0EA5E9', x: 70, y: 0 },
    stats.energy <= 0 && { icon: '😴', label: 'Устал!', color: '#EAB308', x: 0, y: 60 },
    stats.happiness <= 0 && { icon: '😢', label: 'Грустит!', color: '#EC4899', x: -60, y: 50 },
    stats.hygiene <= 0 && { icon: '🫧', label: 'Грязный!', color: '#8B5CF6', x: 60, y: 50 },
  ].filter(Boolean);

  return (
    <motion.div
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'center', position: 'relative' }}
    >
      <AnimatePresence>
        {activeLabel && (
          <motion.div
            key={activeLabel}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            style={{
              position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
              padding: '6px 16px',
              background: currentTrick ? 'linear-gradient(135deg, #22C55E, #16A34A)' : 'linear-gradient(135deg, #F97316, #FB923C)',
              color: 'white', borderRadius: '20px', fontSize: '16px',
              fontFamily: "'Fredoka', sans-serif", fontWeight: '600', whiteSpace: 'nowrap',
              boxShadow: currentTrick ? '0 4px 12px rgba(34, 197, 94, 0.4)' : '0 4px 12px rgba(249, 115, 22, 0.4)',
              zIndex: 10,
            }}
          >
            {activeLabel}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {warnings.map((w, i) => (
          <motion.div
            key={w.label}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(calc(-50% + ${w.x}px), calc(-50% + ${w.y}px))`,
              padding: '6px 12px',
              background: w.color,
              color: 'white',
              borderRadius: '16px',
              fontSize: '13px',
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: '600',
              whiteSpace: 'nowrap',
              boxShadow: `0 4px 12px ${w.color}66`,
              zIndex: 5,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>{w.icon}</span>
            <span>{w.label}</span>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        animate={
          currentTrick === 'roll' || currentTrick === 'spin'
            ? { rotate: [0, 360] }
            : currentTrick === 'fetch'
            ? { x: [0, 40, 0] }
            : currentTrick === 'jump'
            ? { y: [0, -30, 0] }
            : currentAction === 'play'
            ? { y: [0, -20, 0], rotate: [0, 5, -5, 0] }
            : currentAction === 'feed' || currentAction === 'brush'
            ? { rotate: [0, -3, 3, -3, 0] }
            : currentAction === 'walk'
            ? { x: [0, 5, 0, -5, 0] }
            : currentAction === 'sleep'
            ? { rotate: [0, 2, -2, 0] }
            : isAnimating
            ? { rotate: [0, -8, 8, -8, 0], y: [0, -15, 0] }
            : { rotate: 0, y: 0, x: 0 }
        }
        transition={{ duration: currentAction === 'sleep' ? 2 : 0.5, repeat: currentAction === 'sleep' ? Infinity : 0 }}
      >
        <PetSVG
          breedId={breedId}
          primary={primaryColor}
          secondary={secondaryColor}
          ear={earColor}
          mood={mood}
          action={currentAction}
          trick={currentTrick}
          tailAngle={tailAngle}
          scale={scale}
        />
      </motion.div>

      <motion.div
        key={activeLabel || mood}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          marginTop: '8px', padding: '6px 16px',
          background: activeLabel
            ? currentTrick ? 'linear-gradient(135deg, #22C55E, #16A34A)' : 'linear-gradient(135deg, #F97316, #FB923C)'
            : warnings.length > 0
            ? 'linear-gradient(135deg, #DC2626, #EF4444)'
            : 'var(--color-muted)',
          borderRadius: '20px', fontSize: '14px',
          fontFamily: "'Fredoka', sans-serif", display: 'inline-block',
          color: activeLabel || warnings.length > 0 ? 'white' : 'inherit',
        }}
      >
        {activeLabel
          || (warnings.length > 0 && '⚠️ Помоги мне!')
          || (mood === 'happy' && '🎉 Весело!')
          || (mood === 'hungry' && '🍖 Хочет есть!')
          || (mood === 'tired' && '😴 Хочет спать!')
          || (mood === 'playing' && '⚽ Играем!')
          || '❤️ Счастлив!'}
      </motion.div>
    </motion.div>
  );
}
