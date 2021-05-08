export type LessonArchetype = {
  readonly lessonUid: string;
  readonly displayName: string;
  readonly summary: string;
  readonly steps: ReadonlyArray<LessonStepArchetype>;
};

export type LessonStepArchetype =
  | LessonModalStepArchetype
  | LessonPopupStepArchetype;

export type LessonModalStepArchetype = {
  readonly type: 'modal';
  readonly title: string;
  readonly body: string;
};

export type LessonPopupStepArchetype = {
  readonly type: 'popup';
  readonly title: string;
  readonly body: string;
  readonly target: string;
};
