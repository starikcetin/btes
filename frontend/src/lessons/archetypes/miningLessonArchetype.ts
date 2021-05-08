import { LessonArchetype } from '../framework/LessonArchetype';

export const miningLessonArchetype: LessonArchetype = {
  lessonUid: 'mining',
  displayName: 'Mining',
  summary: 'This lesson will teach you the fundamentals of trqansactions.',
  steps: [
    {
      type: 'modal',
      title: 'Mining',
      body:
        'Welcome to the Mining lesson. This lesson will teach you how the new blocks in the blockchain are created.',
    },
  ],
};
