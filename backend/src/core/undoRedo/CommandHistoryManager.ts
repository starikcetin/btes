import { UndoableSimulationCommand } from './UndoableSimulationCommand';

export class CommandHistoryManager {
  private undoStack: UndoableSimulationCommand[] = [];
  private redoStack: UndoableSimulationCommand[] = [];

  /**
   * This method only registers the event to the undo stack.
   * You must perform the first execution on the caller site!
   */
  public register(action: UndoableSimulationCommand): void {
    this.undoStack.push(action);
    this.redoStack = [];
  }

  public undo(): void {
    const toUndo = this.undoStack.pop();
    if (toUndo) {
      toUndo.undo();
      this.redoStack.push(toUndo);
    }
  }

  public redo(): void {
    const toRedo = this.redoStack.pop();
    if (toRedo) {
      toRedo.redo();
      this.undoStack.push(toRedo);
    }
  }
}
