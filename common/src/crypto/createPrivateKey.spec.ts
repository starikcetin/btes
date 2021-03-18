import { createPrivateKey } from './createPrivateKey';

it('creates private key', () => {
  const privateKey = createPrivateKey();
  expect(privateKey).toHaveLength(32);
});

it('creates different private keys', () => {
  const privateKeyA = createPrivateKey();
  const privateKeyB = createPrivateKey();
  expect(privateKeyA).not.toEqual(privateKeyB);
});
