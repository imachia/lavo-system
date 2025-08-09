import { useState, useEffect, useCallback } from 'react';
import { globalCache } from '@/lib/cache';

interface UsePollingOptions {
  interval?: number;
  enabled?: boolean;
  cacheKey?: string;
  onError?: (error: Error) => void;
}

export function usePolling<T>(
  fetchFn: () => Promise<T>,
  options: UsePollingOptions = {}
) {
  const {
    interval = 20000, // 20 segundos padrão
    enabled = true,
    cacheKey,
    onError
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (skipCache = false) => {
    try {
      // Verifica cache primeiro
      if (!skipCache && cacheKey) {
        const cachedData = globalCache.get<T>(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setIsLoading(false);
          return;
        }
      }

      const result = await fetchFn();
      setData(result);
      setError(null);

      // Atualiza cache
      if (cacheKey) {
        globalCache.set(cacheKey, result);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      if (onError) onError(error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, cacheKey, onError]);

  useEffect(() => {
    if (!enabled) return;

    // Primeira chamada
    fetchData();

    // Configura polling
    const intervalId = setInterval(() => {
      fetchData(true); // Skip cache no polling
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [enabled, interval, fetchData]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    return fetchData(true);
  }, [fetchData]);

  return { data, error, isLoading, refetch };
}
