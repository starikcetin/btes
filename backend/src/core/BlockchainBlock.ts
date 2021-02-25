export class BlockchainBlock {
  public readonly name: string;
  public readonly children: BlockchainBlock[];

  constructor(name: string, children: BlockchainBlock[]) {
    this.name = name;
    this.children = children;
  }
}
