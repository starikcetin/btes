import { hashBuffer } from './hashBuffer';

it('hard-coded check', () => {
  const publicKeyHex = Buffer.from(
    '0250863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b2352',
    'hex'
  );

  const expectedHash = Buffer.from(
    '0b7c28c9b7290c98d7438e70b3d3f7c848fbd7d1dc194ff83f4f7cc9b1378e98',
    'hex'
  );

  expect(hashBuffer(publicKeyHex)).toStrictEqual(expectedHash);
});
