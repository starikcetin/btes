import { ControlledTimerConfig } from './ControlledTimerConfig';

export class ControlledTimer {
  public readonly config: ControlledTimerConfig;
  private readonly aborter: (timer: ControlledTimer) => void;

  private elapsedTimeInMs = 0;

  public get isDone(): boolean {
    return this.elapsedTimeInMs >= this.config.waitTimeInMs;
  }

  /**
   * @param aborter This will be called to abort this timer.
   */
  constructor(
    config: ControlledTimerConfig,
    aborter: (timer: ControlledTimer) => void
  ) {
    this.config = config;
    this.aborter = aborter;
  }

  /**
   * Advance this timer's elapsed time by `ms` milliseconds.
   *
   * `ControlledTimerService` calls this to advance the time.
   * You probably don't want to call this yourself.
   */
  public readonly advance = (ms: number): void => {
    this.elapsedTimeInMs += ms;

    if (!Number.isFinite(this.elapsedTimeInMs)) {
      throw new Error(
        `Timer's elapsedTimeInMs overflowed. Current value: ${this.elapsedTimeInMs}`
      );
    }

    if (this.elapsedTimeInMs >= this.config.waitTimeInMs) {
      if (undefined !== this.config.onDone) {
        this.config.onDone();
      }
    }
  };

  public readonly abort = (): void => {
    this.aborter(this);

    if (undefined !== this.config.onAborted) {
      this.config.onAborted();
    }
  };
}
