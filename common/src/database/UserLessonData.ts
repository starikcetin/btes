import { UserLessonCompletionData } from './UserLessonCompletionData';

export type UserLessonData = {
  readonly lessonCompletionDatas: {
    [lessonUid: string]: UserLessonCompletionData | null;
  };
};
