/** A simulation command that does NOT support undo/redo. */
export interface SimulationCommand {
  /** Perform the command. */
  execute(): void;
}
