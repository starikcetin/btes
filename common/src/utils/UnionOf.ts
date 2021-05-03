/**
 * Converts an array type to a union type of its members.
 *
 * @example <caption>With an array type</caption>
 * type FooArray = ['a', 'b', 'c'];
 * type FooUnion = UnionOf<FooArray>; // 'a' | 'b' | 'c'
 *
 * @example <caption>With a literal array</caption>
 * const fooArray = ['a', 'b', 'c'] as const;
 * type FooUnion = UnionOf<typeof fooArray>; // 'a' | 'b' | 'c'
 */
export type UnionOf<T extends ReadonlyArray<unknown>> = T[number];
