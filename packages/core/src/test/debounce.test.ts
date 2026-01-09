import { describe, it, expect } from "vitest";
import { debounce } from "../functions";

describe("debounce", () => {
  it("should debounce a function", () => {
    let count = 0;
    const increment = () => {
      count++;
    };

    const debouncedIncrement = debounce(increment, 100);

    debouncedIncrement();
    debouncedIncrement();
    debouncedIncrement();

    expect(count).toBe(0);

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(count).toBe(1);
        resolve(true);
      }, 150);
    });
  });
  it("should support immediate option", () => {
    let count = 0;
    const increment = () => {
      count++;
    };

    const debouncedIncrement = debounce(increment, 100, {
      immediate: true,
    });

    debouncedIncrement();
    debouncedIncrement();
    debouncedIncrement();

    expect(count).toBe(1);

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(count).toBe(1);
        resolve(true);
      }, 150);
    });
  });
  it("should cancel debounced calls", () => {
    let count = 0;
    const increment = () => {
      count++;
    };

    const debouncedIncrement = debounce(increment, 100);

    debouncedIncrement();
    debouncedIncrement();
    debouncedIncrement();

    debouncedIncrement.cancel();

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(count).toBe(0);
        resolve(true);
      }, 150);
    });
  });
  it("should flush debounced calls", () => {
    let count = 0;
    const increment = () => {
      count++;
    };

    const debouncedIncrement = debounce(increment, 100);

    debouncedIncrement();
    debouncedIncrement();
    debouncedIncrement();

    debouncedIncrement.flush();

    expect(count).toBe(1);

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(count).toBe(1);
        resolve(true);
      }, 150);
    });
  });
  it("should work after a delay", () => {
    let count = 0;
    const increment = () => {
      count++;
    };

    const debouncedIncrement = debounce(increment, 100);

    debouncedIncrement();

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(count).toBe(1);
        debouncedIncrement();
        setTimeout(() => {
          expect(count).toBe(2);
          resolve(true);
        }, 150);
      }, 150);
    });
  });
});