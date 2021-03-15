import { countLeading, countLeadingZeroes } from './countLeading';

it('counts leading zeroes correctly', () => {
  // all
  expect(countLeadingZeroes('000')).toBe(3);

  // leading
  expect(countLeadingZeroes('00__')).toBe(2);

  // leading and trailing
  expect(countLeadingZeroes('00_0')).toBe(2);

  // trailing
  expect(countLeadingZeroes('___0')).toBe(0);

  // none
  expect(countLeadingZeroes('____')).toBe(0);
});

it('counts leading chars correctly', () => {
  // all
  expect(countLeading('aaa', 'a')).toBe(3);

  // leading
  expect(countLeading('aa__', 'a')).toBe(2);

  // leading and trailing
  expect(countLeading('aa_a', 'a')).toBe(2);

  // trailing
  expect(countLeading('___a', 'a')).toBe(0);

  // none
  expect(countLeading('____', 'a')).toBe(0);
});
