import { collectGenerator } from './collectGenerator';

function* gen() {
  yield 1;
  yield 2;
  yield 3;
  return 4;
}

it('collects a generator', () => {
  const walkResult = collectGenerator(gen());

  expect(walkResult.ret).toBe(4);
  expect(walkResult.yields).toStrictEqual([1, 2, 3]);
});
