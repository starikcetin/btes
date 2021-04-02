/**
 * Converts an array type to a union type of its members.
 *
 * @example <caption>With an array type</caption>
 * type FooArray = ['a', 'b', 'c'];
 * type FooUnion = ValueOf<FooArray>; // 'a' | 'b' | 'c'
 *
 * @example <caption>With a literal array</caption>
 * const fooArray = ['a', 'b', 'c'] as const;
 * type FooUnion = ValueOf<typeof fooArray>; // 'a' | 'b' | 'c'
 */
export type ValueOf<T extends ReadonlyArray<unknown>> = T[number];
