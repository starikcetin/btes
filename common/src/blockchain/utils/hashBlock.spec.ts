import { BlockchainBlockHeader } from '../block/BlockchainBlockHeader';
import { hashBlock } from './hashBlock';

it('hard coded test', () => {
  const header: BlockchainBlockHeader = {
    previousHash:
      'ade8617c80bdad229fdfe3dfce60a12ac74d0fca25b0bbddf993a76066994c06',
    leadingZeroCount: 3,
    timestamp: 1616072932290,
    nonce: 4482,
  };

  expect(hashBlock(header)).toBe(
    '0007c28f0a88c19dab11908051ccb2f809e8de6e2342f99553e1260efc4eabf0'
  );
});
