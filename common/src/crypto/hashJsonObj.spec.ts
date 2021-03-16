import { hashJsonObj } from './hashJsonObj';

const original = {
  a: 'foo',
  b: {
    c: 'foobar',
    d: 'barbaz',
  },
  e: [
    {
      f: 1,
      g: 2,
    },
    {
      f: 3,
      g: 4,
    },
  ],
};

const equivalent = {
  e: [
    {
      g: 2,
      f: 1,
    },
    {
      g: 4,
      f: 3,
    },
  ],
  b: {
    d: 'barbaz',
    c: 'foobar',
  },
  a: 'foo',
};

const slightlyDifferent = {
  a: 'foo',
  b: {
    c: 'foobar',
    d: 'barbaz',
  },
  e: [
    {
      f: 1,
      g: 2,
    },
    {
      f: 3,
      g: 6,
    },
  ],
};

const veryDifferent = {
  a: '',
  b: {},
  e: [{}, {}],
};

it('calculates same hash for same objects', () => {
  expect(hashJsonObj(original)).toStrictEqual(hashJsonObj(original));
});

it('calculates same hash for equivalent objects', () => {
  expect(hashJsonObj(original)).toStrictEqual(hashJsonObj(equivalent));
});

it('calculates different hash for slightly different objects', () => {
  const originalHash = hashJsonObj(original);
  const slightlyDifferentHash = hashJsonObj(slightlyDifferent);

  expect(originalHash).not.toStrictEqual(slightlyDifferentHash);
});

it('calculates different hash for very different objects', () => {
  const originalHash = hashJsonObj(original);
  const veryDifferentHash = hashJsonObj(veryDifferent);

  expect(originalHash).not.toEqual(veryDifferentHash);
  expect(originalHash).not.toEqual(veryDifferentHash);
});
