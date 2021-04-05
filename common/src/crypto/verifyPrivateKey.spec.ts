import { verifyPrivateKey } from './verifyPrivateKey';

const hexToBuffer = (hexStr: string): Buffer => Buffer.from(hexStr, 'hex');

it('verifies private keys', () => {
  const correct = hexToBuffer(
    '18e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29a206321725'
  );

  const incorrect = hexToBuffer(
    '0000000000000000000000000000000000000000000000000000000000000000'
  );

  const small = hexToBuffer(
    '18e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29'
  );

  const big = hexToBuffer(
    '18e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29a20632172500000000'
  );

  expect(verifyPrivateKey(correct)).toBeTrue();
  expect(verifyPrivateKey(incorrect)).toBeFalse();
  expect(verifyPrivateKey(small)).toBeFalse();
  expect(verifyPrivateKey(big)).toBeFalse();
});
