type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type MyOmit<T, K extends keyof T> = HandleEmptyObject<Pick<T, Exclude<keyof T, K>>>;

type HandleEmptyObject<T> = T extends Record<string, never> ? void : T;

// --- path helpers ---
type Split<Path extends string> = Path extends `${infer H}.${infer R}` ? [H, ...Split<R>] : [Path];

type IsNumericString<S extends string> = S extends `${number}` ? true : false;
type IsNumberSegment<S extends string> = S extends 'number' ? true : IsNumericString<S>;

// --- core ---
type MakeOptionalAtPath<T, Path extends string> = OptionalAtPath<T, Split<Path>>;

type OptionalAtPath<T, Segs extends string[]> = Segs extends [
	infer Head extends string,
	...infer Rest extends string[]
]
	? OptionalAtPathStep<T, Head, Rest>
	: T;

type OptionalAtPathStep<T, Head extends string, Rest extends string[]> =
	// arrays / tuples
	T extends readonly (infer U)[]
		? IsNumberSegment<Head> extends true
			? // eslint-disable-next-line @typescript-eslint/no-explicit-any
				T extends ReadonlyArray<any>
				? ReadonlyArray<OptionalAtPath<U, Rest>>
				: Array<OptionalAtPath<U, Rest>>
			: T
		: // objects
			Head extends keyof T
			? Rest extends []
				? SetOptionalProp<T, Head, T[Head]>
				: { [K in keyof T]: K extends Head ? OptionalAtPath<T[K], Rest> : T[K] }
			: T;

// mark exactly one property optional
type SetOptionalProp<T, K extends PropertyKey, V> = Omit<T, Extract<K, keyof T>> & {
	[P in Extract<K, keyof T>]?: V;
};

export type { MakeOptional, DeepPartial, MakeOptionalAtPath, MyOmit };
