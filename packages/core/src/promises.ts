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

export function deferred() {
  let resolve = null as unknown as (value: unknown) => void;
  let reject = null as unknown as (reason?: any) => void;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

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
