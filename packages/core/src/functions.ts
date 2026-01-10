import { sleep } from "./promises";

export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
}

/**
 * Debounces a function to prevent excessive calling
 * @param fn The function to debounce
 * @param delay The number of milliseconds to wait after the last call before calling fn
 * @param options immediate: If true, calls fn immediately if more than delay ms since last call, any further calls within delay ms will be debounced
 * @returns The Debounced function
 */
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

/**
 * Throttles a function to only run once for every interval ms
 * @param fn
 * @param interval Minimum amount of time betweeen fn calls
 * @returns The throttled function
 */
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

/**
 * Compares values recursivly
 * @param a First object / value
 * @param b Second object / value
 * @returns If both are equal
 */
export function deepEqual(a: any, b: any): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false;

  const keysA = Object.keys(a);
  if (keysA.length !== Object.keys(b).length) return false;

  return keysA.every((k) => deepEqual(a[k], b[k]));
}

/**
 * Only allows a function to be called once. if called multiple times, the stored result is returned
 * @param fn Function to limit
 * @returns
 */
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

/**
 * Picks certain keys from an object
 * @param obj The object to pick keys from
 * @param keys The keys to pick from the object
 * @returns An object with only the provided keys
 */
export function pick<T, K extends readonly (keyof T)[]>(
  obj: T,
  keys: K
): Pick<T, K[number]> {
  return Object.fromEntries(keys.map((k) => [k, obj[k]])) as Pick<T, K[number]>;
}

/**
 * Excludes certain keys from an object
 * @param obj The object to exclude keys from
 * @param keys The keys to exclude
 * @returns An object with the provided keys exluded
 */
export function omit<
  T extends Record<string, any>,
  K extends readonly (keyof T)[]
>(obj: T, keys: K): Omit<T, K[number]> {
  const set = new Set<keyof T>(keys);
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !set.has(k as keyof T))
  ) as Omit<T, K[number]>;
}
/**
 * Retries an async function attempts times with optional delay
 * @param fn The function to reply
 * @param attempts Max number of attemps
 * @param delayMs Optional number of milliseconds to wait between tries
 * @returns Result of fn
 */
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

/**
 * noop: does nothing
 */
export const noop = () => {};

/**
 * Executes a function and catches any errors and returns a tuple, similar to golang
 * @param fn The function to execute
 * @returns A tuple where:
 *   - The first element is the error if one was thrown, otherwise `null`.
 *   - The second element is the return value of `fn` if no error occurred.
 * @example
 * ```ts
 * const [err, value] = tryCatch(() => JSON.parse('{"x":1}'));
 * if (err) {
 *   console.error("uh oh", err);
 * } else {
 *   console.log("value:", value);
 * }
 * ```
 */
export function tryCatch<T>(
  fn: () => T
): [error: unknown] | [error: null, value: T] {
  try {
    return [null, fn()];
  } catch (e) {
    return [e];
  }
}

/**
 * A function to tap into a value
 * @param fn A function to do something with a value
 * @returns the same value passed in
 * @example
 * ```ts
 * const double = (x: number) => x * 2;
 *
 * const result = [1, 2, 3]
 *   .map(tap(x => console.log("before doubling:", x)))
 *   .map(double);
 *
 * console.log(result);
 * ```
 */
export function tap<T>(fn: (v: T) => void) {
  return (v: T): T => {
    fn(v);
    return v;
  };
}

/**
 * A generator for creating number ranges
 * @param end an end value (exclusive) starting at 0 or an object with start, step and end values
 * start: the value to start at (inclusive)
 * step: how far to increment in each iteration, can be negative, defaults to 1
 * end: the value to end at (exclusive)
 * @example
 * ```ts
 * for (const i of range(5)) {
 *   console.log(i) //0, 1, 2, 3, 4
 * }
 *
 * for (const i of range({
 *   start: 3,
 *   end: 10,
 *   step: 2
 * })) {
 *   console.log(i) //3, 5, 7, 9
 * }
 *
 * for (const i of range({
 *   start: 10,
 *   end: 3,
 *   step: -2
 * })) {
 *   console.log(i) //10, 8, 6, 4
 * }
 * ```
 */
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

/**
 * Returns a generator that loops through an iterator forever
 * @param iterable the iterator to loop over
 * @returns A looping generator
 */
export function* cycle<T>(iterable: Iterable<T>): Generator<T> {
  const items = [...iterable];
  if (!items.length) return;
  while (true) {
    for (const i of items) yield i;
  }
}

/**
 * chunks an array
 * @param arr The array to chunk
 * @param size Maximim size for a chunk
 * @returns
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * shuffles an array
 * @param arr
 * @returns
 */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * returns a random element from an array
 * @param arr
 * @returns
 */
export function sample<T>(arr: T[]): T | undefined {
  if (!arr.length) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * rotates an array
 * @param arr the array
 * @param n number of items to move, positive values rotate the array to the right, and negative values rotate it to the left
 * @returns new array
 */
export function rotate<T>(arr: T[], n: number): T[] {
  const len = arr.length;
  n = ((n % len) + len) % len;
  return [...arr.slice(n), ...arr.slice(0, n)];
}