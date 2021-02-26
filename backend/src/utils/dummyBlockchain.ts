import { BlockchainBlock } from '../common/BlockchainBlock';

export const dummyBlockchain: BlockchainBlock = {
  hash: '34ec7g',
  children: [
    {
      hash: '32380',
      children: [
        {
          hash: 'e21c6',
          children: [
            {
              hash: 'a6877',
              children: [
                {
                  hash: 'b1416',
                  children: [
                    {
                      hash: '904e2',
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              hash: '2f8b1',
              children: [],
            },
          ],
        },
      ],
    },
  ],
};
