import _ from 'lodash';

/**
 * @returns whether both arrays have the same items and same items only.
 * @example
 * // false
 * a = [1, 2, 3]
 * b = [1, 2]
 * // true
 * a = [1, 2, 3]
 * b = [2, 1, 3]
 */
export const itemwiseEqual = <TItem>(a: TItem[], b: TItem[]): boolean => {
  return _.xor(a, b).length === 0;
};
