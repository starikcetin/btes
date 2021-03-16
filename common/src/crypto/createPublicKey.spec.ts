import { createPrivateKey } from './createPrivateKey';
import { createPublicKey } from './createPublicKey';

it('hard-coded test', () => {
  const priv = Buffer.from(
    '18e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29a206321725',
    'hex'
  );

  const expectedPub = Buffer.from(
    '0250863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b2352',
    'hex'
  );

  expect(createPublicKey(priv)).toStrictEqual(expectedPub);
});

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
