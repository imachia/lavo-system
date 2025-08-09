interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class Cache {
  private cache: Map<string, CacheItem<any>> = new Map();
  private ttl: number = 10000; // 10 segundos padrão

  set<T>(key: string, data: T, ttl?: number) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const expired = Date.now() - item.timestamp > this.ttl;
    if (expired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  invalidate(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

export const globalCache = new Cache();
