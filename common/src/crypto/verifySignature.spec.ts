import { createPrivateKey } from './createPrivateKey';
import { createPublicKey } from './createPublicKey';
import { hash } from './hash';
import { createSignature } from './createSignature';
import { verifySignature } from './verifySignature';

const plainText = {
  foo: 'lorem ipsum dolor sit amet',
  bar: ['foo', 'bar', 'baz'],
};

it('accepts correct signature', () => {
  const privateKey = createPrivateKey();
  const publicKey = createPublicKey(privateKey);
  const plainHash = hash(plainText);
  const signature = createSignature(plainHash, privateKey);
  const verification = verifySignature(signature, plainHash, publicKey);

  expect(verification).toBeTrue();
});
