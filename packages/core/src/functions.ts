import { sleep } from "./promises";

export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300,
  options: { immediate?: boolean } = {}
): DebouncedFunction<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: ThisParameterType<T> | undefined;
  let result: ReturnType<T>;

  const debounced = function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ) {
    lastArgs = args;
    lastThis = this;

    const callNow = options.immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!options.immediate && lastArgs) {
        result = fn.apply(lastThis, lastArgs);
        lastArgs = null;
      }
    }, delay);

    if (callNow) {
      result = fn.apply(lastThis, lastArgs!);
      lastArgs = null;
    }

    return result;
  } as unknown as DebouncedFunction<T>;

  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
    timeout = null;
    lastArgs = null;
  };

  debounced.flush = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
      if (lastArgs) {
        fn.apply(lastThis, lastArgs);
        lastArgs = null;
      }
    }
  };

  return debounced;
}

export function throttle<F extends (this: any, ...args: any[]) => void>(
  fn: F,
  interval = 300
): (this: ThisParameterType<F>, ...args: Parameters<F>) => void {
  let last = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    const now = Date.now();
    const remaining = interval - (now - last);

    if (remaining <= 0) {
      last = now;
      fn.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        last = Date.now();
        timeout = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}

export function deepEqual(a: any, b: any): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false;

  const keysA = Object.keys(a);
  if (keysA.length !== Object.keys(b).length) return false;

  return keysA.every((k) => deepEqual(a[k], b[k]));
}

export function once<F extends (this: any, ...args: any[]) => any>(fn: F) {
  let called = false;
  let result: ReturnType<F>;
  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

export function pick<T, K extends readonly (keyof T)[]>(
  obj: T,
  keys: K
): Pick<T, K[number]> {
  return Object.fromEntries(keys.map((k) => [k, obj[k]])) as Pick<T, K[number]>;
}

export function omit<
  T extends Record<string, any>,
  K extends readonly (keyof T)[]
>(obj: T, keys: K): Omit<T, K[number]> {
  const set = new Set<keyof T>(keys);
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !set.has(k as keyof T))
  ) as Omit<T, K[number]>;
}

export async function retry<T>(
  fn: () => Promise<T>,
  attempts: number,
  delayMs = 0
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      if (delayMs) await sleep(delayMs);
    }
  }
  throw lastError;
}

export const noop = () => {};

export function tryCatch<T>(fn: () => T): [error: unknown, value?: T] {
  try {
    return [null, fn()];
  } catch (e) {
    return [e];
  }
}

export function tap<T>(fn: (v: T) => void) {
  return (v: T): T => {
    fn(v);
    return v;
  };
}

export function* range(
  end:
    | number
    | {
        start?: number;
        end: number;
        step?: number;
      }
): Generator<number> {
  let start = 0;
  let step = 1;
  let e = 0;
  if (typeof end === "number") {
    e = end;
  } else {
    start = end.start ?? 0;
    step = end.step ?? 1;
    e = end.end;
  }

  if (step === 0) throw new RangeError("step cannot be 0");
  if (step > 0) {
    for (let i = start; i < e; i += step) yield i;
  } else {
    for (let i = start; i > e; i += step) yield i;
  }
}

export function* cycle<T>(iterable: Iterable<T>): Generator<T> {
  const items = [...iterable];
  if (!items.length) return;
  while (true) {
    for (const i of items) yield i;
  }
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample<T>(arr: T[]): T | undefined {
  if (!arr.length) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

export function rotate<T>(arr: T[], n: number): T[] {
  const len = arr.length;
  n = ((n % len) + len) % len;
  return [...arr.slice(n), ...arr.slice(0, n)];
}