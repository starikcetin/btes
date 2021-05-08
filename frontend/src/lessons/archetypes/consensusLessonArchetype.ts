import { LessonArchetype } from '../framework/LessonArchetype';

export const consensusLessonArchetype: LessonArchetype = {
  lessonUid: 'consensus',
  displayName: 'Consensus',
  summary: 'This lesson will teach you the fundamentals of trqansactions.',
  steps: [
    {
      type: 'modal',
      title: 'Consensus',
      body:
        'Welcome to the Consensus lesson. This lesson will teach you how a blockchain network agrees upon a single true state despite being decentralized and composed of independent nodes.',
    },
  ],
};
