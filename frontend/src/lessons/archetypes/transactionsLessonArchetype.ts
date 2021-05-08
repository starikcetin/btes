import { LessonArchetype } from '../framework/LessonArchetype';

export const transactionsLessonArchetype: LessonArchetype = {
  lessonUid: 'transactions',
  displayName: 'Transactions',
  summary: 'This lesson will teach you the fundamentals of trqansactions.',
  steps: [
    {
      type: 'modal',
      title: 'Transactions',
      body:
        'Welcome to the Transactions lesson. This lesson will teach you what transactions are, how they are created ans transmitted, and what they contain.',
    },
  ],
};
