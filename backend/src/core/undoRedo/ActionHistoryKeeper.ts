import { UndoubleAction } from './UndoubleAction';

export class ActionHistoryKeeper {
  private undoStack: UndoubleAction[] = [];
  private redoStack: UndoubleAction[] = [];

  public registerAndExecute(action: UndoubleAction): void {
    this.undoStack.push(action);
    this.redoStack = [];
    action.execute();
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
      toRedo.execute();
      this.undoStack.push(toRedo);
    }
  }
}
