import { createPrivateKey } from './createPrivateKey';
import { createPublicKey } from './createPublicKey';
import { hashJsonObj } from './hashJsonObj';
import { createSignature } from './createSignature';
import { verifySignature } from './verifySignature';
import { randomBytes } from 'crypto';
import { hashBuffer } from './hashBuffer';

const plainText = {
  foo: 'lorem ipsum dolor sit amet',
  bar: ['foo', 'bar', 'baz'],
};

it('accepts correct signature for objects', () => {
  const privateKey = createPrivateKey();
  const publicKey = createPublicKey(privateKey);
  const plainHash = hashJsonObj(plainText);
  const signature = createSignature(plainHash, privateKey);
  const verification = verifySignature(signature, plainHash, publicKey);

  expect(verification).toBeTrue();
});

it('accepts correct signature for strings', () => {
  const privateKey = createPrivateKey();
  const publicKey = createPublicKey(privateKey);
  const plainHash = hashJsonObj('foobar');
  const signature = createSignature(plainHash, privateKey);
  const verification = verifySignature(signature, plainHash, publicKey);

  expect(verification).toBeTrue();
});

it('accepts correct signature for buffers', () => {
  const privateKey = createPrivateKey();
  const publicKey = createPublicKey(privateKey);
  const plainHash = hashBuffer(randomBytes(32));
  const signature = createSignature(plainHash, privateKey);
  const verification = verifySignature(signature, plainHash, publicKey);

  expect(verification).toBeTrue();
});
