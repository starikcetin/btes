import { BlockchainBlockHeader } from '../block/BlockchainBlockHeader';
import { hashBlock } from './hashBlock';

it('hard coded test', () => {
  const header: BlockchainBlockHeader = {
    previousHash:
      '339516038c41fa454caea3fb9ef3093044ee00ad2b62420d343f6e985c4a23fb',
    leadingZeroCount: 3,
    timestamp: 1617114965872,
    nonce: 642,
  };

  expect(hashBlock(header)).toBe(
    '00083dfd9fbdde6fc65eee3dc6025941447acdd0fb93361a562944daf1bbeb1f'
  );
});
