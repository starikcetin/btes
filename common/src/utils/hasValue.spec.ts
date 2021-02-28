import { hasValue } from './hasValue';

it('returns false for null or undefined', () => {
  expect(hasValue(null)).toBe(false);
  expect(hasValue(undefined)).toBe(false);
});

it('returns true for primitive or object', () => {
  const primitive = 1;
  expect(hasValue(primitive)).toBe(true);

  const obj = {};
  expect(hasValue(obj)).toBe(true);
});
