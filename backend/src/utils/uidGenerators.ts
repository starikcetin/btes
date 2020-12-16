class UidGenerator {
  private counter = 0;

  public next() {
    return this.counter++;
  }
}

export const simulationUidGenerator = new UidGenerator();
export const nodeUidGenerator = new UidGenerator();
