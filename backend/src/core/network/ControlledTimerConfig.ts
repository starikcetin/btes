export interface ControlledTimerConfig {
  readonly waitTimeInMs: number;
  readonly onDone?: () => void;
  readonly onAborted?: () => void;
}
