import {
  simulationUidGenerator,
  nodeUidGenerator,
  mailUidGenerator,
} from './uidGenerators';

it('generates unique ids', () => {
  expect(simulationUidGenerator.next()).not.toBe(simulationUidGenerator.next());
  expect(nodeUidGenerator.next()).not.toBe(nodeUidGenerator.next());
  expect(mailUidGenerator.next()).not.toBe(mailUidGenerator.next());
});
