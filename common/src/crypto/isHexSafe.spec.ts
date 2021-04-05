import { isHexSafe } from './isHexSafe';

it('determines if hex string is safe', () => {
  const safe = '0123456789abcdefABCDEF';
  expect(isHexSafe(safe)).toBeTrue();

  const unsafe = '0123456789abgh.,cdefABCDEF';
  expect(isHexSafe(unsafe)).toBeFalse();
});
