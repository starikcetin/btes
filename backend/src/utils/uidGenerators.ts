import { v1 as uuidv1 } from 'uuid';

class UidGenerator {
  public next() {
    return uuidv1();
  }
}

export const simulationUidGenerator = new UidGenerator();
export const nodeUidGenerator = new UidGenerator();
export const mailUidGenerator = new UidGenerator();
