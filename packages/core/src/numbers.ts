/**
 * one^two
 * @param one
 * @param two
 * @returns one^two
 */
export function bigIntPower(one: bigint, two: bigint): bigint {
  if (two === 0n) return 1n;
  const powerTwo = bigIntPower(one, two / 2n);
  if (two % 2n === 0n) return powerTwo * powerTwo;
  return one * powerTwo * powerTwo;
}

/**
 * converts numbers between bases
 * @param value The value to convert betweem bases
 * @param sourceBase the base of value
 * @param outBase the base to convert value to
 * @param chars the characters to use, defaults to convertBase.defaultChars
 * @returns value in base outBase
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
 * the default characters used in convertBase
 */
convertBase.defaultChars =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-/=[];',.";
/**
 * the maximum base for convertBase, assuming default characters
 */
convertBase.MAX_BASE = convertBase.defaultChars.length;

/**
 * Clamps a number between min and max
 * @param number 
 * @param min 
 * @param max 
 * @returns 
 */
export function clamp(number: number, min: number, max: number) {
  return Math.max(min, Math.min(max, number));
}

/**
 * Returns a random integer between min and max 
 * @param min 
 * @param max 
 * @param inclusive if true, max is included in the possible outputs
 * @returns 
 */
export function randInt(min: number, max: number, inclusive = true) {
  if (min > max) {
    throw new RangeError("RandInt: min cannot be greater than max");
  }
  return Math.floor(Math.random() * (max - min + +inclusive)) + min;
}

/**
 * Returns true approximately (probablity * 100)% of the time
 * @param probability 
 * @returns 
 */
export function chance(probability: number): boolean {
  return Math.random() < probability;
}

/**
 * Rounds a number to a certain number of decimals
 * @param n 
 * @param decimals 
 * @returns 
 */
export function roundTo(n: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

/**
 * Interpolates between a and b
 * @param a 
 * @param b 
 * @param t 
 * @returns 
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * determines if n is in a range
 * @param n 
 * @param min 
 * @param max 
 * @returns true if n is inbetween min and max
 */
export function inRange(n: number, min: number, max: number): boolean {
  return n >= min && n <= max;
}
