import _ from 'lodash';

import { SimulationNamespaceEmitter } from '../SimulationNamespaceEmitter';
import { ControlledTimer } from './ControlledTimer';
import { ControlledTimerConfig } from './ControlledTimerConfig';

export class ControlledTimerService {
  private readonly socketEmitter: SimulationNamespaceEmitter;

  private readonly activeTimers: ControlledTimer[] = [];
  private readonly rawTickPeriodInMs = 10;

  private currentTicker?: NodeJS.Timeout;
  private timeScale = 1;

  constructor(socketEmitter: SimulationNamespaceEmitter) {
    this.socketEmitter = socketEmitter;
  }

  private get scaledTickPeriodInMs() {
    return this.rawTickPeriodInMs * this.timeScale;
  }

  /** Starts the service. Time won't flow before you call this. */
  public readonly begin = (): void => {
    this.currentTicker = setInterval(this.tick, this.rawTickPeriodInMs);
  };

  public readonly pause = (): void => {
    if (undefined !== this.currentTicker) {
      clearInterval(this.currentTicker);
    }

    this.socketEmitter.sendSimulationPaused();
  };

  public readonly resume = (): void => {
    this.currentTicker = setInterval(this.tick, this.rawTickPeriodInMs);

    this.socketEmitter.sendSimulationResumed();
  };

  /**
   * Changes how fast the time is flowing. A larger time scale means active timers will finish faster.
   *
   * Time scale is initially `1`.
   *
   * At each tick, active timers will be advanced using this formula: `elapsedTime = timeScale * tickPeriod`
   */
  public readonly setTimeScale = (timeScale: number): void => {
    this.timeScale = timeScale;
  };

  public readonly createTimer = (
    config: ControlledTimerConfig
  ): ControlledTimer => {
    const newTimer = new ControlledTimer(config, this.cleanupTimer);
    this.activeTimers.push(newTimer);
    return newTimer;
  };

  private readonly tick = (): void => {
    const scaledTickPeriodInMs = this.scaledTickPeriodInMs;

    for (const timer of this.activeTimers) {
      timer.advance(scaledTickPeriodInMs);

      if (timer.isDone) {
        this.cleanupTimer(timer);
      }
    }
  };

  private readonly cleanupTimer = (timer: ControlledTimer) => {
    _.remove(this.activeTimers, timer);
  };
}
