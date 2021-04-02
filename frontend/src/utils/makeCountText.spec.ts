import { makeCountText } from './makeCountText';

it('pluralizes correctly', () => {
  expect(makeCountText(0, 'datum')).toBe('datums');
  expect(makeCountText(1, 'datum')).toBe('datum');
  expect(makeCountText(2, 'datum')).toBe('datums');

  expect(makeCountText(0, 'datum', { prefix: true })).toBe('0 datums');
  expect(makeCountText(1, 'datum', { prefix: true })).toBe('1 datum');
  expect(makeCountText(2, 'datum', { prefix: true })).toBe('2 datums');

  expect(makeCountText(0, 'datum', { plural: 'data' })).toBe('data');
  expect(makeCountText(1, 'datum', { plural: 'data' })).toBe('datum');
  expect(makeCountText(2, 'datum', { plural: 'data' })).toBe('data');

  expect(makeCountText(0, 'datum', { plural: 'data', prefix: true })).toBe(
    '0 data'
  );
  expect(makeCountText(1, 'datum', { plural: 'data', prefix: true })).toBe(
    '1 datum'
  );
  expect(makeCountText(2, 'datum', { plural: 'data', prefix: true })).toBe(
    '2 data'
  );

  expect(makeCountText(0, 'datum', { zero: 'No' })).toBe('datums');
  expect(makeCountText(1, 'datum', { zero: 'No' })).toBe('datum');
  expect(makeCountText(2, 'datum', { zero: 'No' })).toBe('datums');

  expect(makeCountText(0, 'datum', { zero: 'No', prefix: true })).toBe(
    'No datums'
  );
  expect(makeCountText(1, 'datum', { zero: 'No', prefix: true })).toBe(
    '1 datum'
  );
  expect(makeCountText(2, 'datum', { zero: 'No', prefix: true })).toBe(
    '2 datums'
  );

  expect(makeCountText(0, 'datum', { zero: 'No', plural: 'data' })).toBe(
    'data'
  );
  expect(makeCountText(1, 'datum', { zero: 'No', plural: 'data' })).toBe(
    'datum'
  );
  expect(makeCountText(2, 'datum', { zero: 'No', plural: 'data' })).toBe(
    'data'
  );

  expect(
    makeCountText(0, 'datum', { zero: 'No', plural: 'data', prefix: true })
  ).toBe('No data');
  expect(
    makeCountText(1, 'datum', { zero: 'No', plural: 'data', prefix: true })
  ).toBe('1 datum');
  expect(
    makeCountText(2, 'datum', { zero: 'No', plural: 'data', prefix: true })
  ).toBe('2 data');
});
