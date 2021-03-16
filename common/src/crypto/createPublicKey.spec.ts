import { createPrivateKey } from './createPrivateKey';
import { createPublicKey } from './createPublicKey';

it('creates public key', () => {
  const privateKey = createPrivateKey();
  const publicKey = createPublicKey(privateKey);

  expect(publicKey).toHaveLength(33);
});

it('creates the same public key from the same private key', () => {
  const privateKey = createPrivateKey();
  const publicKeyA = createPublicKey(privateKey);
  const publicKeyB = createPublicKey(privateKey);

  expect(publicKeyA).toStrictEqual(publicKeyB);
});

it('creates different public keys for different private keys', () => {
  const privateKeyA = createPrivateKey();
  const privateKeyB = createPrivateKey();
  const publicKeyA = createPublicKey(privateKeyA);
  const publicKeyB = createPublicKey(privateKeyB);

  expect(publicKeyA).not.toEqual(publicKeyB);
});
