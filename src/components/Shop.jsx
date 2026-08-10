import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const shopItems = [
  {
    id: 'food_premium',
    name: 'Премиум еда',
    icon: '🥩',
    description: '+50 к голоду',
    price: 30,
    category: 'food',
    effect: { hunger: 50 },
  },
  {
    id: 'golden_treat',
    name: 'Золотое лакомство',
    icon: '⭐',
    description: '+40 к счастью',
    price: 50,
    category: 'food',
    effect: { happiness: 40 },
  },
  {
    id: 'mega_water',
    name: 'Мега вода',
    icon: '💦',
    description: '+60 к жажде',
    price: 25,
    category: 'food',
    effect: { thirst: 60 },
  },
  {
    id: 'shampoo',
    name: 'Шампунь',
    icon: '🧴',
    description: '+50 к гигиене',
    price: 40,
    category: 'care',
    effect: { hygiene: 50 },
  },
  {
    id: 'energy_drink',
    name: 'Энергетик',
    icon: '⚡',
    description: '+40 к энергии',
    price: 35,
    category: 'care',
    effect: { energy: 40 },
  },
  {
    id: 'toy_ball',
    name: 'Мяч',
    icon: '🏐',
    description: '+30 к счастью',
    price: 60,
    category: 'toys',
    effect: { happiness: 30 },
  },
  {
    id: 'squeaky_toy',
    name: 'Пищащая игрушка',
    icon: '🧸',
    description: '+25 к счастью',
    price: 45,
    category: 'toys',
    effect: { happiness: 25 },
  },
  {
    id: 'xp_boost',
    name: 'Буст XP',
    icon: '🚀',
    description: '+100 XP сразу',
    price: 100,
    category: 'boost',
    effect: { xp: 100 },
  },
  {
    id: 'coin_pack',
    name: 'Мешок монет',
    icon: '💰',
    description: '+50 монет',
    price: 150,
    category: 'boost',
    effect: { coins: 50 },
  },
  {
    id: 'mood_perfume',
    name: 'Парфюм',
    icon: '💐',
    description: '+35 к настроению',
    price: 55,
    category: 'care',
    effect: { mood: 35 },
  },
];

const categories = [
  { id: 'all', label: 'Все', icon: '🛒' },
  { id: 'food', label: 'Еда', icon: '🍖' },
  { id: 'care', label: 'Уход', icon: '🫧' },
  { id: 'toys', label: 'Игрушки', icon: '🧸' },
  { id: 'boost', label: 'Бусты', icon: '🚀' },
];

export default function Shop({ coins, onBuy }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [buyAnimation, setBuyAnimation] = useState(null);

  const filteredItems = activeCategory === 'all'
    ? shopItems
    : shopItems.filter(i => i.category === activeCategory);

  const handleBuy = (item) => {
    if (coins < item.price) return;
    setBuyAnimation(item.id);
    onBuy(item);
    setTimeout(() => setBuyAnimation(null), 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', flexDirection: 'column', gap: '12px',
        padding: '14px', background: 'white', borderRadius: '20px',
        boxShadow: '8px 8px 16px #d4d4d4, -8px -8px 16px #ffffff',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{
          margin: 0, fontSize: '16px', fontFamily: "'Fredoka', sans-serif",
        }}>
          🛒 Магазин
        </h3>
        <span style={{
          padding: '4px 12px', background: '#FEF3C7', borderRadius: '12px',
          fontSize: '14px', fontFamily: "'Fredoka', sans-serif", fontWeight: '600',
          color: '#92400E',
        }}>
          🪙 {coins}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map(cat => (
          <motion.button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '8px 14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              background: activeCategory === cat.id ? 'linear-gradient(135deg, #F97316, #FB923C)' : '#F3F4F6',
              color: activeCategory === cat.id ? 'white' : '#6B7280',
              fontFamily: "'Fredoka', sans-serif", fontSize: '12px', fontWeight: '500',
              whiteSpace: 'nowrap',
            }}
          >
            {cat.icon} {cat.label}
          </motion.button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
        <AnimatePresence mode="popLayout">
          {filteredItems.map(item => {
            const canBuy = coins >= item.price;
            const isBuying = buyAnimation === item.id;
            return (
              <motion.button
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={canBuy ? { scale: 1.03, y: -2 } : {}}
                whileTap={canBuy ? { scale: 0.95 } : {}}
                onClick={() => handleBuy(item)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: '4px', padding: '12px 8px', borderRadius: '14px',
                  border: canBuy ? '2px solid #E5E7EB' : '2px solid #F3F4F6',
                  background: isBuying ? 'linear-gradient(135deg, #22C55E, #16A34A)' : canBuy ? 'white' : '#F9FAFB',
                  cursor: canBuy ? 'pointer' : 'not-allowed',
                  opacity: canBuy ? 1 : 0.5,
                  transition: 'background 0.2s',
                }}
              >
                <motion.span
                  style={{ fontSize: '28px' }}
                  animate={isBuying ? { scale: [1, 1.4, 1], rotate: [0, 10, -10, 0] } : {}}
                >
                  {item.icon}
                </motion.span>
                <span style={{
                  fontSize: '12px', fontFamily: "'Fredoka', sans-serif",
                  fontWeight: '600', color: '#374151',
                }}>
                  {item.name}
                </span>
                <span style={{
                  fontSize: '10px', fontFamily: "'Nunito', sans-serif", color: '#6B7280',
                }}>
                  {item.description}
                </span>
                <span style={{
                  padding: '3px 10px', borderRadius: '10px',
                  background: canBuy ? '#FEF3C7' : '#F3F4F6',
                  fontSize: '12px', fontFamily: "'Fredoka', sans-serif",
                  fontWeight: '600', color: canBuy ? '#92400E' : '#9CA3AF',
                }}>
                  🪙 {item.price}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
