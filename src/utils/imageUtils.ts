/**
 * Утилитарная функция для получения правильного URL изображения
 * @param imageUrl - URL изображения из базы данных
 * @returns Полный URL изображения
 */
export const getImageUrl = (imageUrl?: string): string => {
  if (!imageUrl) {
    return '';
  }
  
  // Если URL уже полный (начинается с http), возвращаем как есть
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Если это относительный путь, добавляем базовый URL сервера
  return `http://localhost:5000${imageUrl}`;
};
