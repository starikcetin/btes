import { createPrivateKey } from './createPrivateKey';
import { createSignature } from './createSignature';
import { hashJsonObj } from './hashJsonObj';

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
  const plainHash = hashJsonObj(plainA);
  const signature = createSignature(plainHash, privateKey);

  expect(signature).toHaveLength(64);
});

it('creates the same signature for the same inputs', () => {
  const privateKey = createPrivateKey();
  const plainHash = hashJsonObj(plainA);

  const signatureA = createSignature(plainHash, privateKey);
  const signatureB = createSignature(plainHash, privateKey);

  expect(signatureA).toStrictEqual(signatureB);
});

describe('creates different signatures', () => {
  it('for different plaintext', () => {
    const privateKey = createPrivateKey();

    const plainAHash = hashJsonObj(plainA);
    const plainBHash = hashJsonObj(plainB);

    const signatureA = createSignature(plainAHash, privateKey);
    const signatureB = createSignature(plainBHash, privateKey);

    expect(signatureA).not.toEqual(signatureB);
  });

  it('for different private keys', () => {
    const privateKeyA = createPrivateKey();
    const privateKeyB = createPrivateKey();

    const plainHash = hashJsonObj(plainA);

    const signatureA = createSignature(plainHash, privateKeyA);
    const signatureB = createSignature(plainHash, privateKeyB);

    expect(signatureA).not.toEqual(signatureB);
  });
});
