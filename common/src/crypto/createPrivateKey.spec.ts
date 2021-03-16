import { createPrivateKey } from './createPrivateKey';

it('creates private key', () => {
  const privateKey = createPrivateKey();

  expect(privateKey.base64).toHaveLength(44);
  expect(privateKey.byteArray).toHaveLength(32);
});

it('creates different private keys', () => {
  const privateKeyA = createPrivateKey();
  const privateKeyB = createPrivateKey();

  expect(privateKeyA.base64).not.toBe(privateKeyB.base64);
  expect(privateKeyA.byteArray).not.toBe(privateKeyB.byteArray);
});
