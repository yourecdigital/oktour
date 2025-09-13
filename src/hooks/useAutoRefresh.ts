import { useEffect, useRef } from 'react';

interface UseAutoRefreshOptions {
  interval?: number; // интервал обновления в миллисекундах
  enabled?: boolean; // включить/выключить автообновление
}

export const useAutoRefresh = (
  callback: () => void | Promise<void>,
  options: UseAutoRefreshOptions = {}
) => {
  const { interval = 30000, enabled = true } = options; // по умолчанию каждые 30 секунд
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Первоначальный вызов
    callback();

    // Устанавливаем интервал
    intervalRef.current = setInterval(callback, interval);

    // Очистка при размонтировании
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [callback, interval, enabled]);

  // Функция для принудительного обновления
  const refresh = () => {
    callback();
  };

  return { refresh };
};






