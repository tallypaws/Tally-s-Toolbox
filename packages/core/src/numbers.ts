/*
 * JSDocs proofread by Kat (discord, GH @AutoTheKat)
 * Code by Tally Paws (discord @Tally.gay | GH @TallyPaws)
 * 
 * JAN/10/2026 0:20 EST ~
 */

/**
 * BigInt Exponent Operation.
 * @param one The base.
 * @param two The exponent.
 * @returns The bigint result of `one` to the power of `two`.
 */
// kat loves herself some math terminology :D
export function bigIntPower(one: bigint, two: bigint): bigint {
  if (two === 0n) return 1n;
  const powerTwo = bigIntPower(one, two / 2n);
  if (two % 2n === 0n) return powerTwo * powerTwo;
  return one * powerTwo * powerTwo;
}

/**
 * Converts numbers between bases. (e.g. hexadecimal to binary)
 * @param value The value to convert.
 * @param sourceBase The base of value.
 * @param outBase The result's base.
 * @param chars The characters to use, defaults to `convertBase.defaultChars`.
 * @returns The resulting value in specified base using the specified characters.
 */
export function convertBase(
  value: string,
  sourceBase: number,
  outBase: number,
  chars = convertBase.defaultChars
): string {
  const range = [...chars];
  if (sourceBase < 2 || sourceBase > range.length)
    throw new RangeError(`sourceBase must be between 2 and ${range.length}`);
  if (outBase < 2 || outBase > range.length)
    throw new RangeError(`outBase must be between 2 and ${range.length}`);

  const outBaseBig = BigInt(outBase);

  let decValue = [...value].toReversed().reduce((carry, digit, loopIndex) => {
    const biggestBaseIndex = range.indexOf(digit);
    if (biggestBaseIndex === -1 || biggestBaseIndex > sourceBase - 1)
      throw new ReferenceError(
        `Invalid digit ${digit} for base ${sourceBase}.`
      );
    return (
      carry +
      BigInt(biggestBaseIndex) *
        bigIntPower(BigInt(sourceBase), BigInt(loopIndex))
    );
  }, 0n);

  let output = "";
  while (decValue > 0) {
    output = `${range[Number(decValue % outBaseBig)] ?? ""}${output}`;
    decValue = (decValue - (decValue % outBaseBig)) / outBaseBig;
  }
  return output || "0";
}

/**
 * The default characters used in convertBase.
 */
convertBase.defaultChars =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-/=[];',.";
/**
 * The maximum base for convertBase, using the default characters.
 */
convertBase.MAX_BASE = convertBase.defaultChars.length;

/**
 * Clamps a number between min and max.
 * @param number The number to clamp.
 * @param min The minimum number.
 * @param max The maximum number.
 * @returns The number clamped to the range specified.
 */
// Kat didn't understand this...
export function clamp(number: number, min: number, max: number) {
  return Math.max(min, Math.min(max, number));
}

/**
 * Returns a random integer between min and max 
 * @param min The minimum number.
 * @param max The maximum number. Exclusive by default, like Java's `Math.Random()`.
 * @param inclusive Determines whether the `max` is included or excluded from the range.
 * @returns A random number within the range specified.
 */
export function randInt(min: number, max: number, inclusive = true) {
  if (min > max) {
    throw new RangeError("RandInt: min cannot be greater than max");
  }
  return Math.floor(Math.random() * (max - min + +inclusive)) + min;
}

/**
 * Returns true approximately (probablity * 100)% of the time
 * @param probability Number between 0 and 1.
 * @returns A boolean averaging the probability specified.
 */
export function chance(probability: number): boolean {
  return Math.random() < probability;
}

/**
 * Rounds a number to a certain number of decimals.
 * @param n The number to round.
 * @param decimals The number of places.
 * @returns Number rounded to specified places.
 * @example 
 * ```ts
 * console.log(roundTo(Math.PI, 5));
 * ```
 * shows as `3.14159` in the console.
 */
export function roundTo(n: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

/**
 * Interpolates between a and b.
 * @param a 
 * @param b 
 * @param t 
 * @returns 
 */
// Kat also doesn't understand this (or interpolation at large). She's sorry about that.
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Determines if a value is in a range.
 * @param n The number to check for in a range.
 * @param min The minimum of the range.
 * @param max The maximum of the range.
 * @returns If the number is in the specified range.
 */
export function inRange(n: number, min: number, max: number): boolean {
  return n >= min && n <= max;
}
