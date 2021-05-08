import { LessonArchetype } from '../framework/LessonArchetype';

export const blocksLessonArchetype: LessonArchetype = {
  lessonUid: 'blocks',
  displayName: 'Blocks',
  summary: 'This lesson will teach you the fundamentals of blocks.',
  steps: [
    {
      type: 'modal',
      title: 'Blocks',
      body:
        'Welcome to the Blocks lesson. This lesson will teach you what blocks are, how they are created ans transmitted, and what they contain.',
    },
  ],
};
