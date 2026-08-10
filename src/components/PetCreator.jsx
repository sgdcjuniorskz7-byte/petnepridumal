import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { breeds, accessories, colorPresets, sizeOptions } from '../data/breeds';
import Menu from './Menu';

const steps = ['breed', 'name', 'customize', 'accessories', 'preview'];

function BreedSelector({ selected, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <h3 style={{
        margin: '0',
        fontSize: '20px',
        textAlign: 'center',
        fontFamily: "'Fredoka', sans-serif",
        color: '#374151',
      }}>
        🐾 Выбери питомца
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        maxHeight: '65vh',
        overflowY: 'auto',
        padding: '4px',
      }}>
        {breeds.map(breed => (
          <motion.button
            key={breed.id}
            onClick={() => onSelect(breed)}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '14px 8px',
              background: selected?.id === breed.id
                ? 'linear-gradient(135deg, #F97316, #FB923C)'
                : 'white',
              color: selected?.id === breed.id ? 'white' : '#374151',
              borderRadius: '16px',
              border: selected?.id === breed.id
                ? '3px solid #EA580C'
                : '3px solid #E5E7EB',
              cursor: 'pointer',
              boxShadow: selected?.id === breed.id
                ? '0 6px 20px rgba(249, 115, 22, 0.4)'
                : '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <motion.span
              style={{ fontSize: '28px' }}
              animate={selected?.id === breed.id ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {breed.emoji}
            </motion.span>
            <span style={{
              fontSize: '11px',
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: '500',
            }}>
              {breed.name}
            </span>
          </motion.button>
        ))}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            padding: '14px',
            background: 'rgba(249, 115, 22, 0.1)',
            borderRadius: '14px',
            border: '1px solid rgba(249, 115, 22, 0.3)',
          }}
        >
          <p style={{
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontFamily: "'Fredoka', sans-serif",
            color: '#EA580C',
          }}>
            {selected.name} {selected.emoji}
          </p>
          <p style={{
            margin: '0',
            fontSize: '13px',
            color: '#9A3412',
            fontFamily: "'Nunito', sans-serif",
          }}>
            {selected.description}
          </p>
          <div style={{
            display: 'flex',
            gap: '6px',
            marginTop: '10px',
            flexWrap: 'wrap',
          }}>
            {selected.traits.map(trait => (
              <span
                key={trait}
                style={{
                  padding: '3px 8px',
                  background: 'rgba(249, 115, 22, 0.2)',
                  borderRadius: '10px',
                  fontSize: '10px',
                  fontFamily: "'Fredoka', sans-serif",
                  color: '#9A3412',
                }}
              >
                {trait}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function NameInput({ value, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'center',
      }}
    >
      <h3 style={{
        margin: '0',
        fontSize: '20px',
        textAlign: 'center',
        fontFamily: "'Fredoka', sans-serif",
        color: '#374151',
      }}>
        ✏️ Дай имя
      </h3>

      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {['Шарик', 'Мурзик', 'Барсик', 'Тузик', 'Рекс', 'Мухтар'].map(name => (
          <motion.button
            key={name}
            onClick={() => onChange(name)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            style={{
              padding: '10px 18px',
              background: value === name
                ? 'linear-gradient(135deg, #F97316, #FB923C)'
                : '#F3F4F6',
              color: value === name ? 'white' : '#374151',
              borderRadius: '12px',
              border: value === name
                ? '2px solid #EA580C'
                : '2px solid #E5E7EB',
              cursor: 'pointer',
              fontFamily: "'Fredoka', sans-serif",
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            {name}
          </motion.button>
        ))}
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Или введи своё имя..."
        maxLength={15}
        style={{
          width: '100%',
          maxWidth: '280px',
          padding: '14px 18px',
          fontSize: '18px',
          fontFamily: "'Fredoka', sans-serif",
          borderRadius: '14px',
          border: '2px solid #E5E7EB',
          outline: 'none',
          textAlign: 'center',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => e.target.style.borderColor = '#F97316'}
        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
      />
    </motion.div>
  );
}

function Customizer({ color, onColorChange, size, onSizeChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <h3 style={{
        margin: '0',
        fontSize: '20px',
        textAlign: 'center',
        fontFamily: "'Fredoka', sans-serif",
        color: '#374151',
      }}>
        🎨 Настрой внешний вид
      </h3>

      <div>
        <p style={{
          margin: '0 0 10px 0',
          fontSize: '14px',
          fontFamily: "'Fredoka', sans-serif",
          color: '#6B7280',
        }}>
          Цвет:
        </p>
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {colorPresets.map(c => (
            <motion.button
              key={c.id}
              onClick={() => onColorChange(c)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
                border: color?.id === c.id
                  ? '3px solid #EA580C'
                  : '3px solid white',
                cursor: 'pointer',
                boxShadow: color?.id === c.id
                  ? `0 0 0 2px ${c.primary}, 0 4px 12px ${c.primary}66`
                  : '0 2px 6px rgba(0,0,0,0.15)',
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <p style={{
          margin: '0 0 10px 0',
          fontSize: '14px',
          fontFamily: "'Fredoka', sans-serif",
          color: '#6B7280',
        }}>
          Размер:
        </p>
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {sizeOptions.map(s => (
            <motion.button
              key={s.id}
              onClick={() => onSizeChange(s)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '10px 16px',
                background: size?.id === s.id
                  ? 'linear-gradient(135deg, #F97316, #FB923C)'
                  : '#F3F4F6',
                color: size?.id === s.id ? 'white' : '#374151',
                borderRadius: '12px',
                border: size?.id === s.id
                  ? '2px solid #EA580C'
                  : '2px solid #E5E7EB',
                cursor: 'pointer',
                fontFamily: "'Fredoka', sans-serif",
                fontSize: '13px',
              }}
            >
              {s.name}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function AccessorySelector({ selected, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <h3 style={{
        margin: '0',
        fontSize: '20px',
        textAlign: 'center',
        fontFamily: "'Fredoka', sans-serif",
        color: '#374151',
      }}>
        👗 Аксессуары
      </h3>

      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <motion.button
          onClick={() => onSelect(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '12px 20px',
            background: !selected
              ? 'linear-gradient(135deg, #22C55E, #16A34A)'
              : '#F3F4F6',
            color: !selected ? 'white' : '#374151',
            borderRadius: '14px',
            border: !selected
              ? '2px solid #15803D'
              : '2px solid #E5E7EB',
            cursor: 'pointer',
            fontFamily: "'Fredoka', sans-serif",
            fontSize: '14px',
          }}
        >
          Нет
        </motion.button>

        {accessories.map(acc => (
          <motion.button
            key={acc.id}
            onClick={() => onSelect(acc)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '12px 16px',
              background: selected?.id === acc.id
                ? 'linear-gradient(135deg, #F97316, #FB923C)'
                : 'white',
              color: selected?.id === acc.id ? 'white' : '#374151',
              borderRadius: '14px',
              border: selected?.id === acc.id
                ? '2px solid #EA580C'
                : '2px solid #E5E7EB',
              cursor: 'pointer',
              boxShadow: selected?.id === acc.id
                ? '0 4px 12px rgba(249, 115, 22, 0.4)'
                : '0 2px 6px rgba(0,0,0,0.08)',
            }}
          >
            <span style={{ fontSize: '24px' }}>{acc.emoji}</span>
            <span style={{
              fontSize: '10px',
              fontFamily: "'Fredoka', sans-serif",
            }}>
              {acc.name}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export default function PetCreator({ onComplete }) {
  const [step, setStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [petConfig, setPetConfig] = useState({
    breed: null,
    breedId: null,
    name: '',
    color: colorPresets[0],
    size: sizeOptions[2],
    accessory: null,
  });

  const updateConfig = useCallback((key, value) => {
    setPetConfig(prev => {
      const updated = { ...prev, [key]: value };
      // Обновляем breedId при выборе породы
      if (key === 'breed' && value) {
        updated.breedId = value.id;
      }
      return updated;
    });
  }, []);

  const canProceed = () => {
    switch (step) {
      case 0: return !!petConfig.breed;
      case 1: return petConfig.name.trim().length > 0;
      case 2: return !!petConfig.color && !!petConfig.size;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(petConfig);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        height: '100vh',
        padding: '20px',
        overflowY: 'auto',
        background: 'linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 50%, #FFF7ED 100%)',
      }}
    >
      <Menu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelect={(id) => {
          setMenuOpen(false);
          if (id === 'help') alert('💡 Выбери породу и следуй инструкциям!');
        }}
        petConfig={null}
        state={{ name: 'Новый питомец' }}
        progress={{ level: 1, coins: 0 }}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: 'center',
          marginBottom: '24px',
          position: 'relative',
        }}
      >
        <motion.button
          onClick={() => setMenuOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'white', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: '4px',
            boxShadow: '2px 2px 6px #d4d4d4, -2px -2px 6px #ffffff',
          }}
        >
          <span style={{ width: '18px', height: '2px', background: '#374151', borderRadius: '1px' }} />
          <span style={{ width: '14px', height: '2px', background: '#374151', borderRadius: '1px' }} />
          <span style={{ width: '10px', height: '2px', background: '#374151', borderRadius: '1px' }} />
        </motion.button>
        <h1 style={{
          fontSize: '28px',
          fontFamily: "'Fredoka', sans-serif",
          background: 'linear-gradient(135deg, #F97316, #2563EB)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          🐕 Создай питомца
        </h1>
      </motion.div>

      {/* Progress */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '24px',
      }}>
        {steps.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === step ? '32px' : '8px',
              background: i <= step ? '#F97316' : '#E5E7EB',
            }}
            style={{
              height: '8px',
              borderRadius: '4px',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '460px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '8px 8px 16px #d4d4d4, -8px -8px 16px #ffffff',
      }}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <BreedSelector
              key="breed"
              selected={petConfig.breed}
              onSelect={(breed) => updateConfig('breed', breed)}
            />
          )}
          {step === 1 && (
            <NameInput
              key="name"
              value={petConfig.name}
              onChange={(name) => updateConfig('name', name)}
            />
          )}
          {step === 2 && (
            <Customizer
              key="customize"
              color={petConfig.color}
              onColorChange={(color) => updateConfig('color', color)}
              size={petConfig.size}
              onSizeChange={(size) => updateConfig('size', size)}
            />
          )}
          {step === 3 && (
            <AccessorySelector
              key="accessories"
              selected={petConfig.accessory}
              onSelect={(acc) => updateConfig('accessory', acc)}
            />
          )}
          {step === 4 && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <h3 style={{
                margin: '0',
                fontSize: '20px',
                textAlign: 'center',
                fontFamily: "'Fredoka', sans-serif",
                color: '#374151',
              }}>
                👀 Предпросмотр
              </h3>

              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  fontSize: '80px',
                  filter: `drop-shadow(0 4px 12px ${petConfig.color?.primary || '#000'}66)`,
                }}
              >
                {petConfig.breed?.emoji}
              </motion.div>

              <div style={{
                padding: '16px',
                background: '#F9FAFB',
                borderRadius: '16px',
                width: '100%',
              }}>
                <p style={{
                  margin: '0 0 8px 0',
                  fontSize: '22px',
                  fontFamily: "'Fredoka', sans-serif",
                  color: '#374151',
                  textAlign: 'center',
                }}>
                  {petConfig.name}
                </p>
                <p style={{
                  margin: '0',
                  fontSize: '14px',
                  color: '#6B7280',
                  textAlign: 'center',
                  fontFamily: "'Nunito', sans-serif",
                }}>
                  {petConfig.breed?.name} • {petConfig.size?.name}
                  {petConfig.accessory ? ` • ${petConfig.accessory.name}` : ''}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '24px',
      }}>
        {step > 0 && (
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '14px 28px',
              background: '#F3F4F6',
              color: '#374151',
              borderRadius: '14px',
              border: '2px solid #E5E7EB',
              cursor: 'pointer',
              fontFamily: "'Fredoka', sans-serif",
              fontSize: '16px',
            }}
          >
            ← Назад
          </motion.button>
        )}

        <motion.button
          onClick={handleNext}
          disabled={!canProceed()}
          whileHover={canProceed() ? { scale: 1.05 } : {}}
          whileTap={canProceed() ? { scale: 0.95 } : {}}
          style={{
            padding: '14px 32px',
            background: canProceed()
              ? 'linear-gradient(135deg, #F97316, #FB923C)'
              : '#E5E7EB',
            color: canProceed() ? 'white' : '#9CA3AF',
            borderRadius: '14px',
            border: 'none',
            cursor: canProceed() ? 'pointer' : 'not-allowed',
            fontFamily: "'Fredoka', sans-serif",
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: canProceed()
              ? '0 4px 12px rgba(249, 115, 22, 0.4)'
              : 'none',
          }}
        >
          {step === steps.length - 1 ? 'Начать! →' : 'Далее →'}
        </motion.button>
      </div>
    </motion.div>
  );
}
