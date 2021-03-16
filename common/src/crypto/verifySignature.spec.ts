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
  const publicKey = createPublicKey(privateKey.byteArray);
  const plainHash = hash(plainText);
  const signature = createSignature(plainHash.byteArray, privateKey.byteArray);
  const verification = verifySignature(
    signature.byteArray,
    plainHash.byteArray,
    publicKey.byteArray
  );

  expect(verification).toBeTrue();
});
