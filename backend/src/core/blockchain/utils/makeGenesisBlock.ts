import { BlockchainBlock } from '../../../common/blockchain/BlockchainBlock';
import { encodeBuffer } from '../../../common/blockchain/utils/encodeBuffer';
import { createAddress } from '../../../common/crypto/createAddress';
import { createPrivateKey } from '../../../common/crypto/createPrivateKey';
import { createPublicKey } from '../../../common/crypto/createPublicKey';

export const makeGenesisBlock = (): BlockchainBlock => {
  const zero64 = '0'.repeat(64);

  const privKey = createPrivateKey();
  const publicKey = createPublicKey(privKey);
  const address = createAddress(publicKey);
  const encodedAddress = encodeBuffer(address, 'address');

  return {
    header: {
      previousHash: zero64,
      timestamp: 0,
      leadingZeroCount: 0,
      nonce: 0,
    },
    txs: [
      {
        isCoinbase: true,
        inputs: [
          {
            coinbase: 'genesis block coinbase',
          },
        ],
        outputs: [
          {
            value: 20,
            lockingScript: {
              address: encodedAddress,
            },
          },
        ],
      },
    ],
  };
};
