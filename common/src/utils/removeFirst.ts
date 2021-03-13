import _ from 'lodash';

/** Removes the first element from the array that matches predicate, and returns it. Returns null if no elements match. */
export const removeFirst = <TData>(
  arr: TData[],
  predicate: (elm: TData) => boolean
): TData | null => {
  const index = _.findIndex(arr, predicate);
  return index === -1 ? null : arr.splice(index, 1)[0];
};
