export type Nullable<T> = T | null;

export type Recordable<T = any> = Record<string, T>;

export type TimeoutHandle = ReturnType<typeof setTimeout>;

export type IntervalHandle = ReturnType<typeof setInterval>;
