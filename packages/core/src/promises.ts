/*
 * JSDocs proofread by Kat (discord, GH @AutoTheKat)
 * Code by Tally Paws (discord @Tally.gay | GH @TallyPaws)
 * 
 * JAN/10/2026 0:32 EST ~
 */

/**
 * Returns a promise that resolves in a certain amount of milliseconds.
 * Note: this won't be 100% accurate.
 * @param ms The number of milliseconds to wait.
 * @returns The promise.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export class AsyncQueue {
  private queue = Promise.resolve();

  run<T>(fn: () => Promise<T>): Promise<T> {
    const res = this.queue.then(fn, fn);
    this.queue = res.then(
      () => {},
      () => {}
    );
    return res;
  }
}


/**
 * Creates a deferred promise.
 *
 * Useful when the promise must be resolved or rejected from outside its executor.
 *
 * @returns An object containing:
 *  - `promise`: Promise<unknown>
 *  - `resolve`: (value: unknown) => void
 *  - `reject`: (reason?: any) => void
 *
 * @example
 * const { promise, resolve, reject } = deferred();
 * // `resolve('ok')` or `reject(new Error('fail'))` can be called later.
 */
export function deferred() {
  let resolve = null as unknown as (value: unknown) => void;
  let reject = null as unknown as (reason?: any) => void;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

/**
 * Limits a promise's waiting time with a timeout.
 * @param promise The promise to time.
 * @param ms How many milliseconds to wait before timing out.
 * @param error The error to throw after the set delay.
 * @returns The timed out promise.
 */
export function timeoutPromise<T>(
  promise: Promise<T>,
  ms: number,
  error = new Error("Timed out")
) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(error), ms)),
  ]);
}
