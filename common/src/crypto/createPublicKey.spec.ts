import { createPrivateKey } from './createPrivateKey';
import { createPublicKey } from './createPublicKey';

it('creates public key', () => {
  const privateKey = createPrivateKey();
  const publicKey = createPublicKey(privateKey.byteArray);

  expect(publicKey.base64).toHaveLength(44);
  expect(publicKey.byteArray).toHaveLength(33);
});

it('creates the same public key from the same private key', () => {
  const privateKey = createPrivateKey();
  const publicKeyA = createPublicKey(privateKey.byteArray);
  const publicKeyB = createPublicKey(privateKey.byteArray);

  expect(publicKeyA).toStrictEqual(publicKeyB);
});

it('creates different public keys for different private keys', () => {
  const privateKeyA = createPrivateKey();
  const privateKeyB = createPrivateKey();
  const publicKeyA = createPublicKey(privateKeyA.byteArray);
  const publicKeyB = createPublicKey(privateKeyB.byteArray);

  expect(publicKeyA.base64).not.toBe(publicKeyB.base64);
  expect(publicKeyA.byteArray).not.toBe(publicKeyB.byteArray);
});
