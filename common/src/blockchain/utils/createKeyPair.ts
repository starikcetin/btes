import { hasValue } from '../../utils/hasValue';
import { createPrivateKey } from '../../crypto/createPrivateKey';
import { BlockchainKeyPair } from '../BlockchainKeyPair';
import { createPublicKey } from '../../crypto/createPublicKey';
import { createAddress } from '../../crypto/createAddress';
import { encodeBuffer } from './encodeBuffer';

/** Creates a private key, a public key, and an address. Can be supplied a private key to use instead of creating a new one. */
export const createKeyPair = (privateKey?: Buffer): BlockchainKeyPair => {
  if (!hasValue(privateKey)) {
    privateKey = createPrivateKey();
  }

  const publicKey = createPublicKey(privateKey);
  const address = createAddress(publicKey);

  return {
    privateKey: encodeBuffer(privateKey, 'address'),
    publicKey: encodeBuffer(publicKey, 'address'),
    address: encodeBuffer(address, 'address'),
  };
};
