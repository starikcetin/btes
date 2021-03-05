import { itemwiseEqual } from './itemwiseEqual';

it('itemwise compares primitive arrays correctly', () => {
  const original = [1, 2, 3, 4];
  const copy = [...original];
  const equivalent = [4, 2, 3, 1];
  const incomplete = [1, 2, 3];
  const different = [1, 2, 3, 5];

  // itemwise equal
  expect(itemwiseEqual(original, copy)).toBe(true);
  expect(itemwiseEqual(original, equivalent)).toBe(true);

  // not itemwise equal
  expect(itemwiseEqual(original, incomplete)).toBe(false);
  expect(itemwiseEqual(original, different)).toBe(false);
});
