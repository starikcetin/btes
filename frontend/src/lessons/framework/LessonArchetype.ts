import { SocketEvent } from '../../common/constants/socketEvents';

export type LessonArchetype = {
  readonly lessonUid: string;
  readonly displayName: string;
  readonly summary: string;
  readonly steps: ReadonlyArray<LessonStepArchetype>;
};

export type LessonStepArchetype =
  | LessonModalStepArchetype
  | LessonPopupStepArchetype
  | LessonWaitStepArchetype;

export type LessonModalStepArchetype = {
  readonly type: 'modal';
  readonly title: string;
  readonly body: string;
  readonly footer: string;
};

export type LessonPopupStepArchetype = {
  readonly type: 'popup';
  readonly title: string;
  readonly body: string;
  readonly targetElementId: string;
};

export type LessonWaitStepArchetype = LessonWaitSocketEventStepArchetype;

export type LessonWaitSocketEventStepArchetype = {
  readonly type: 'wait';
  readonly waitType: 'socketEvent';
  readonly socketEvent: SocketEvent;
};
