/**
 * Like `keyof`, but for values instead of keys.
 *
 * @example <caption>With an object type</caption>
 * type FooObject = { a: 'foo', b: 'bar', c: 'baz' };
 * type FooValues = ValueOf<FooObject>; // 'foo' | 'bar' | 'baz'
 *
 * @example <caption>With an object literal</caption>
 * const fooObject = { a: 'foo', b: 'bar', c: 'baz' } as const;
 * type FooValues = ValueOf<typeof fooObject>; // 'foo' | 'bar' | 'baz'
 */
export type ValueOf<T> = T[keyof T];
