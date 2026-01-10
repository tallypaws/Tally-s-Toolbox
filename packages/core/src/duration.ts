import { Flat } from "./types";

const msValues = {
  ms: 1,
  s: 1000,
  m: 1000 * 60,
  h: 1000 * 60 * 60,
  d: 1000 * 60 * 60 * 24,
};


type DurationBuilderLongBase = {
  toMilliseconds(): number;
  toSeconds(): number;
  toMinutes(): number;
  toHours(): number;
  toDays(): number;
};

type DurationBuilderShortBase = {
  toMs(): number;
  toS(): number;
  toM(): number;
  toH(): number;
  toD(): number;
};

type LongValues = {
  milliseconds(v: number): DurationBuilderLong;
  seconds(v: number): DurationBuilderLong;
  minutes(v: number): DurationBuilderLong;
  hours(v: number): DurationBuilderLong;
  days(v: number): DurationBuilderLong;
};

type DurationBuilderLong = Flat<DurationBuilderLongBase & LongValues>;

type ShortValues = {
  ms(v: number): DurationBuilderShort;
  s(v: number): DurationBuilderShort;
  m(v: number): DurationBuilderShort;
  h(v: number): DurationBuilderShort;
  d(v: number): DurationBuilderShort;
};

type DurationBuilderShort = Flat<DurationBuilderShortBase & ShortValues>;

function durationLong(initialMs = 0): DurationBuilderLong {
  let total = initialMs;

  const add = (v: number, mult: number) => {
    total += v * mult;
    return builder;
  };

  const builder: DurationBuilderLong = {
    toMilliseconds: () => total,

    toSeconds: () => total / msValues.s,
    toMinutes: () => total / msValues.m,
    toHours: () => total / msValues.h,
    toDays: () => total / msValues.d,

    milliseconds: (v) => add(v, msValues.ms),
    seconds: (v) => add(v, msValues.s),
    minutes: (v) => add(v, msValues.m),
    hours: (v) => add(v, msValues.h),
    days: (v) => add(v, msValues.d),
  };

  return builder;
}

function durationShort(initialMs = 0): DurationBuilderShort {
  let total = initialMs;

  const add = (v: number, mult: number) => {
    total += v * mult;
    return builder;
  };

  const builder: DurationBuilderShort = {
    toMs: () => total,

    toS: () => total / msValues.s,
    toM: () => total / msValues.m,
    toH: () => total / msValues.h,
    toD: () => total / msValues.d,

    /**
     * a
     * @param v 
     * @returns 
     */
    ms: (v) => add(v, msValues.ms),
    s: (v) => add(v, msValues.s),
    m: (v) => add(v, msValues.m),
    h: (v) => add(v, msValues.h),
    d: (v) => add(v, msValues.d),
  };

  return builder;
}

function cS(unit: keyof ShortValues) {
  return (v: number) => durationShort()[unit](v);
}

function cL(unit: keyof LongValues) {
  return (v: number) => durationLong()[unit](v);
}

export const days = cL("days");
export const hours = cL("hours");
export const minutes = cL("minutes");
export const seconds = cL("seconds");
export const milliseconds = cL("milliseconds");

export const d = cS("d");
export const h = cS("h");
export const m = cS("m");
export const s = cS("s");
export const ms = cS("ms");

// short
// d(12).h(5).s(4).toS();
// l o n g
// days(12).hours(5).seconds(4).toSeconds();
// invalid no do this
//! days(12).h(5).s(4).toS();
//! d(12).hours(5).seconds(4).toS();
