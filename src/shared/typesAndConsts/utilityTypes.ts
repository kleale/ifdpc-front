export type Limited<T> = { [L in keyof T]?: T[L] | null };
