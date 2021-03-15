import { hash } from './hash';

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
  expect(hash(original)).toBe(hash(original));
});

it('calculates same hash for equivalent objects', () => {
  expect(hash(original)).toBe(hash(equivalent));
});

it('calculates different hash for slightly different objects', () => {
  expect(hash(original)).not.toBe(hash(slightlyDifferent));
});

it('calculates different hash for very different objects', () => {
  expect(hash(original)).not.toBe(hash(veryDifferent));
});
