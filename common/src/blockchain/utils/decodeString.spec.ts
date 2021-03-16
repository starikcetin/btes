import { decodeString } from './decodeString';

it('address hard-coded test', () => {
  const encodedStr = '14RCpjq2QRHuQsthsy6jAAdrVc47J';

  const expectedAddrRaw = Buffer.from(
    '00f54a5851e9372b87810a8e60cdd2e7cfd80b6e31',
    'hex'
  );

  expect(decodeString(encodedStr, 'address')).toStrictEqual(expectedAddrRaw);
});
