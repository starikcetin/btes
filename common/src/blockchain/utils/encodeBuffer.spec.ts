import { encodeBuffer } from './encodeBuffer';

it('address hard-coded test', () => {
  const addrRaw = Buffer.from(
    '00f54a5851e9372b87810a8e60cdd2e7cfd80b6e31',
    'hex'
  );

  const expectedEncodedStr = '14RCpjq2QRHuQsthsy6jAAdrVc47J';

  expect(encodeBuffer(addrRaw, 'address')).toBe(expectedEncodedStr);
});
