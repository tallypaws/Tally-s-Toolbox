export type ValueOf<T> = T[keyof T];

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};
  
export type Nullable<T> = T | null | undefined;

export type NonNullable<T> = T extends null | undefined ? never : T;

export type TupleOf<
  T,
  N extends number,
  R extends T[] = []
> = R["length"] extends N ? R : TupleOf<T, N, [T, ...R]>;

export type Merge<A, B> = Omit<A, keyof B> & B;
