type Timer = ReturnType<typeof setTimeout>;

/**
 * A map with time-limited keys.
 * Keys are deleted after a set amount of time.
 */
export class TimedMap<K, V> {
  private map = new Map<K, V>();
  private timers = new Map<K, Timer>();
  constructor(private defaultTtlMs?: number) {}

  set(key: K, value: V, ttlMs = this.defaultTtlMs) {
    this.map.set(key, value);

    const timer = setTimeout(() => {
      this.map.delete(key);
      this.timers.delete(key);
    }, ttlMs);

    this.timers.set(key, timer);
  }

  has(key: K): boolean {
    return this.map.has(key);
  }

  clear(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }

    this.timers.clear();
    this.map.clear();
  }

  get(key: K): V | undefined {
    return this.map.get(key);
  }

  delete(key: K): boolean {
    const timer = this.timers.get(key);
    if (timer) clearTimeout(timer);

    this.timers.delete(key);
    return this.map.delete(key);
  }

  get size(): number {
    return this.map.size;
  }
}
