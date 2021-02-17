import { SimulationCommand } from '../SimulationCommand';

export interface UndoableSimulationCommand extends SimulationCommand {
  /** Perform the action for the first time. */
  execute(): void;

  /** Perform the action again after an undo. */
  redo(): void;

  /** Revert the action. */
  undo(): void;
}
