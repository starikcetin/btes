import { BlockchainBlock } from '../../../common/blockchain/block/BlockchainBlock';
import { decodeString } from '../../../common/blockchain/utils/decodeString';
import { encodeBuffer } from '../../../common/blockchain/utils/encodeBuffer';
import { createAddress } from '../../../common/crypto/createAddress';
import { createPublicKey } from '../../../common/crypto/createPublicKey';

export const makeGenesisBlock = (): BlockchainBlock => {
  const zero64 = '0'.repeat(64);

  const privateKey = decodeString(
    'B9Jg6X65h8XRNMN6z5wef1K5gWzoam25iFMzWkWD9aVG',
    'address'
  );

  const publicKey = createPublicKey(privateKey);
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
        inputs: [
          {
            isCoinbase: true,
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
