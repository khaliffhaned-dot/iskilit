// A simple client-side caching service using localStorage.

const CACHE_PREFIX = 'escalate_cache_';
const TTL = 10 * 60 * 1000; // 10 minutes Time-to-Live

interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

/**
 * Creates a unique key for a given function and its parameters, namespaced by workspace.
 * @param functionName The name of the function being cached.
 * @param workspaceId The ID of the active workspace.
 * @param params An object or array of parameters.
 * @returns A unique string key.
 */
export const createKey = (functionName: string, workspaceId: string, params: any): string => {
  const paramsString = JSON.stringify(params);
  return `${CACHE_PREFIX}${workspaceId}_${functionName}_${paramsString}`;
};

/**
 * Retrieves an item from the cache if it exists and is not expired.
 * @param key The cache key.
 * @returns The cached data or null.
 */
export const get = <T>(key: string): T | null => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }

  try {
    const item: CacheEntry<T> = JSON.parse(itemStr);
    const now = new Date().getTime();
    if (now - item.timestamp > TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return item.data;
  } catch (error) {
    console.error(`Error reading cache for key ${key}:`, error);
    return null;
  }
};

/**
 * Stores an item in the cache with the current timestamp.
 * @param key The cache key.
 * @param data The data to store.
 */
export const set = <T>(key: string, data: T): void => {
  const item: CacheEntry<T> = {
    timestamp: new Date().getTime(),
    data,
  };
  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error(`Error setting cache for key ${key}:`, error);
    // Handle potential storage full errors
    if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        console.warn('Cache storage is full. Clearing old entries might be necessary.');
    }
  }
};