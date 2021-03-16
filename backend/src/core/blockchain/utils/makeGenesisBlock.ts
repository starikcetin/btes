import { BlockchainBlock } from '../../../common/blockchain/BlockchainBlock';

export const makeGenesisBlock = (): BlockchainBlock => {
  const fullZeroHex = '0'.repeat(64);

  return {
    header: {
      previousHash: fullZeroHex,
      timestamp: 0,
      leadingZeroCount: 0,
      nonce: 0,
    },
    txs: [
      {
        inputs: [
          {
            previousOutput: {
              txHash: fullZeroHex,
              outputIndex: -1,
            },
            unlockingScript: {},
          },
        ],
        outputs: [
          {
            value: 13,
            lockingScript: {},
          },
        ],
        isCoinbase: true,
      },
    ],
  };
};
