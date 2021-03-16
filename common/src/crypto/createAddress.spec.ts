import { createAddress } from './createAddress';

const hexToBuffer = (hexStr: string): Buffer => Buffer.from(hexStr, 'hex');

it('hard-coded test', () => {
  const pub = hexToBuffer(
    '0250863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b2352'
  );
  const expectedAddress = hexToBuffer(
    '00f54a5851e9372b87810a8e60cdd2e7cfd80b6e31'
  );

  expect(createAddress(pub)).toStrictEqual(expectedAddress);
});
