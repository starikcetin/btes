import { removeFirst } from './removeFirst';

it('removes the first element that matches predicate', () => {
  const arr = [1, 2, 3, 4, 5];
  const removed = removeFirst(arr, (e) => e % 2 === 0);

  expect(removed).toBe(2);
  expect(arr).toStrictEqual([1, 3, 4, 5]);
});

it('returns null and does not remove if no element mathces predicate', () => {
  const arr = [1, 2, 3, 4, 5];
  const removed = removeFirst(arr, (e) => e % 10 === 0);

  expect(removed).toBeNull();
  expect(arr).toStrictEqual([1, 2, 3, 4, 5]);
});
