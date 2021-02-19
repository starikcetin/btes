import _ from 'lodash';

// TODO: separate deep and shallow comparison versions

// TODO: improve performance.
//  _.xor does not early out on first diff:
// https://stackoverflow.com/q/29951293/#comment104385161_54788640

// TODO: test for these item types:
// 1. non-primitive
// 2. complex
// 3. nested

/**
 * @returns whether both arrays have the same items and same items only.
 *
 * @example
 * // false
 * a = [1, 2, 3]
 * b = [1, 2]
 *
 * // true
 * a = [1, 2, 3]
 * b = [2, 1, 3]
 */
export const itemwiseEqual = <TItem>(a: TItem[], b: TItem[]): boolean => {
  return _.xor(a, b).length === 0;
};
