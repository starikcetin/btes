import { isBase58Safe } from './isBase58Safe';

it('determines if base58 string is safe', () => {
  const safe = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  expect(isBase58Safe(safe)).toBeTrue();

  const unsafe =
    '123456789ABCDEFGHJKLMNPQRSTIOl0+/UVWXYZabcdefghijkmnopqrstuvwxyz';
  expect(isBase58Safe(unsafe)).toBeFalse();
});
