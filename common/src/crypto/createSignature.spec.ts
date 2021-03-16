import { createPrivateKey } from './createPrivateKey';
import { createSignature } from './createSignature';
import { hash } from './hash';

const plainA = {
  foo: 'lorem ipsum dolor sit amet',
  bar: ['foo', 'bar', 'baz'],
};

const plainB = {
  foo: 'lorem ipsum',
  bar: ['baz'],
};

it('creates signature', () => {
  const privateKey = createPrivateKey();
  const plainHash = hash(plainA);
  const signature = createSignature(plainHash.byteArray, privateKey.byteArray);

  expect(signature.base64).toHaveLength(88);
  expect(signature.byteArray).toHaveLength(64);
});

it('creates the same signature for the same inputs', () => {
  const privateKey = createPrivateKey();
  const plainHash = hash(plainA);

  const signatureA = createSignature(plainHash.byteArray, privateKey.byteArray);
  const signatureB = createSignature(plainHash.byteArray, privateKey.byteArray);

  expect(signatureA).toStrictEqual(signatureB);
});

describe('creates different signatures', () => {
  it('for different plaintext', () => {
    const privateKey = createPrivateKey();

    const plainAHash = hash(plainA);
    const signatureA = createSignature(
      plainAHash.byteArray,
      privateKey.byteArray
    );

    const plainBHash = hash(plainB);
    const signatureB = createSignature(
      plainBHash.byteArray,
      privateKey.byteArray
    );

    expect(signatureA.base64).not.toBe(signatureB.base64);
    expect(signatureA.byteArray).not.toBe(signatureB.byteArray);
  });

  it('for different private keys', () => {
    const privateKeyA = createPrivateKey();
    const privateKeyB = createPrivateKey();

    const plainHash = hash(plainA);

    const signatureA = createSignature(
      plainHash.byteArray,
      privateKeyA.byteArray
    );

    const signatureB = createSignature(
      plainHash.byteArray,
      privateKeyB.byteArray
    );

    expect(signatureA.base64).not.toBe(signatureB.base64);
    expect(signatureA.byteArray).not.toBe(signatureB.byteArray);
  });
});
