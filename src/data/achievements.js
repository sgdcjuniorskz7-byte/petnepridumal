export const achievements = [
  // Уход
  { id: 'first_feed', name: 'Первый корм', emoji: '🍖', description: 'Покорми питомца в первый раз', condition: 'feed', target: 1 },
  { id: 'feed_10', name: 'Много еды', emoji: '🍖', description: 'Покорми 10 раз', condition: 'feed', target: 10 },
  { id: 'feed_50', name: 'Шеф-повар', emoji: '👨‍🍳', description: 'Покорми 50 раз', condition: 'feed', target: 50 },
  { id: 'first_water', name: 'Первая вода', emoji: '💧', description: 'Напои питомца в первый раз', condition: 'water', target: 1 },
  { id: 'water_25', name: 'Источник', emoji: '⛲', description: 'Напои 25 раз', condition: 'water', target: 25 },

  // Общение
  { id: 'first_pet', name: 'Первые объятия', emoji: '❤️', description: 'Погладь питомца', condition: 'pet', target: 1 },
  { id: 'pet_100', name: 'Любимец', emoji: '💕', description: 'Погладь 100 раз', condition: 'pet', target: 100 },
  { id: 'first_photo', name: 'Фотограф', emoji: '📸', description: 'Сделай первое фото', condition: 'photo', target: 1 },
  { id: 'photo_25', name: 'Модель', emoji: '🌟', description: 'Сделай 25 фото', condition: 'photo', target: 25 },

  // Активность
  { id: 'first_play', name: 'Первая игра', emoji: '⚽', description: 'Поиграй с питомцем', condition: 'play', target: 1 },
  { id: 'play_50', name: 'Игрок', emoji: '🎮', description: 'Поиграй 50 раз', condition: 'play', target: 50 },
  { id: 'first_walk', name: 'Первая прогулка', emoji: '🌳', description: 'Сходи на прогулку', condition: 'walk', target: 1 },
  { id: 'walk_30', name: 'Путешественник', emoji: '🗺️', description: 'Сходи на 30 прогулок', condition: 'walk', target: 30 },

  // Гигиена
  { id: 'first_brush', name: 'Первая причёска', emoji: '🪮', description: 'Расчеши питомца', condition: 'brush', target: 1 },
  { id: 'first_wash', name: 'Первое мытьё', emoji: '🛁', description: 'Помой питомца', condition: 'wash', target: 1 },
  { id: 'hygiene_master', name: 'Чистюля', emoji: '✨', description: 'Выполни 100 действий гигиены', condition: 'hygiene_actions', target: 100 },

  // Трюки
  { id: 'first_trick', name: 'Первый трюк', emoji: '🎓', description: 'Научи питомца первому трюку', condition: 'trick', target: 1 },
  { id: 'tricks_5', name: 'Дрессировщик', emoji: '🐕', description: 'Научи 5 трюкам', condition: 'trick', target: 5 },
  { id: 'tricks_all', name: 'Мастер трюков', emoji: '🏆', description: 'Научи все 10 трюков', condition: 'trick', target: 10 },

  // Уровни
  { id: 'level_5', name: 'Новичок', emoji: '⭐', description: 'Достигни 5 уровня', condition: 'level', target: 5 },
  { id: 'level_10', name: 'Профи', emoji: '🌟', description: 'Достигни 10 уровня', condition: 'level', target: 10 },
  { id: 'level_25', name: 'Эксперт', emoji: '💫', description: 'Достигни 25 уровня', condition: 'level', target: 25 },
  { id: 'level_50', name: 'Легенда', emoji: '👑', description: 'Достигни 50 уровня', condition: 'level', target: 50 },

  // Особые
  { id: 'full_happiness', name: 'Счастье', emoji: '😊', description: 'Доведи счастье до 100', condition: 'happiness_100', target: 1 },
  { id: 'survive_day', name: 'Выживший', emoji: '📅', description: 'Продержись день', condition: 'day_survived', target: 1 },
  { id: 'week_player', name: 'Неделя заботы', emoji: '🗓️', description: 'Играй 7 дней подряд', condition: 'streak_7', target: 7 },
];

export const levelThresholds = Array.from({ length: 100 }, (_, i) => ({
  level: i + 1,
  xpRequired: Math.floor(100 * Math.pow(1.2, i)),
  title: i < 10 ? 'Новичок' : i < 25 ? 'Профи' : i < 50 ? 'Эксперт' : 'Легенда',
}));

export const dailyRewards = [
  { day: 1, xp: 50, coins: 10, emoji: '🎁' },
  { day: 2, xp: 75, coins: 15, emoji: '🎁' },
  { day: 3, xp: 100, coins: 20, emoji: '🎁' },
  { day: 4, xp: 125, coins: 25, emoji: '🎁' },
  { day: 5, xp: 150, coins: 30, emoji: '🎁' },
  { day: 6, xp: 200, coins: 40, emoji: '🎁' },
  { day: 7, xp: 300, coins: 50, emoji: '🏆' },
];
