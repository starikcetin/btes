import { UndoubleAction } from './UndoubleAction';

export class ActionHistoryKeeper {
  private undoStack: UndoubleAction[] = [];
  private redoStack: UndoubleAction[] = [];

  /**
   * This method only registers the enevt to the undo stack.
   * You must perform the first execution on the caller site!
   */
  public register(action: UndoubleAction): void {
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
