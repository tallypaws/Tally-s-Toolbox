import { describe, expect, it } from "vitest";
import * as dur from "../duration";
describe("duration", () => {
  it("", () => {
    expect(dur.days(1).toMilliseconds()).toBe(1000 * 60 * 60 * 24);
    expect(dur.d(1).toMs()).toBe(1000 * 60 * 60 * 24);

    expect(dur.days(1).toSeconds()).toBe(60 * 60 * 24);
    expect(dur.d(1).toS()).toBe(60 * 60 * 24);

    expect(dur.days(2).toSeconds()).toBe(60 * 60 * 24 * 2);
    expect(dur.d(2).toS()).toBe(60 * 60 * 24 * 2);
  });
});
