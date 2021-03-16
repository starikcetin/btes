import { BlockchainLockingScript } from '../../../common/blockchain/BlockchainLockingScript';
import { BlockchainUnlockingScript } from '../../../common/blockchain/BlockchainUnlockingScript';
import { decodeString } from '../../../common/blockchain/utils/decodeString';
import { verifySignature } from '../../../common/crypto/verifySignature';
import { createAddress } from '../../../common/crypto/createAddress';

/**
 * * https://btcinformation.org/en/developer-guide#p2pkh-script-validation
 * * Verifies that the given `unlockingScript` unlocks the given `lockingScript`.
 */
export const checkScriptsUnlock = (
  partialTxHash: Buffer,
  lockingScript: BlockchainLockingScript,
  unlockingScript: BlockchainUnlockingScript
): boolean => {
  const address = decodeString(lockingScript.address, 'address');
  const publicKey = decodeString(unlockingScript.publicKey, 'address');
  const signature = decodeString(unlockingScript.signature, 'address');

  const derivedAddress = createAddress(publicKey);

  return (
    derivedAddress.equals(address) &&
    verifySignature(signature, partialTxHash, publicKey)
  );
};
