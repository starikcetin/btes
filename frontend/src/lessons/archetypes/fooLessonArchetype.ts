import { LessonArchetype } from '../framework/LessonArchetype';

export const fooLessonArchetype: LessonArchetype = {
  lessonUid: 'foo',
  displayName: 'Foo',
  summary:
    'This is a test lesson. It will teach you how to cook pizza, conquer the world, and find true love.',
  steps: [
    {
      type: 'modal',
      title: 'I am a modal title',
      body: 'I am a modal body',
    },
    {
      type: 'popup',
      targetElementId: '.comp-simulation--board',
      title: 'I am a popup title',
      body: 'I am a popup body',
    },
    {
      type: 'popup',
      targetElementId: '.comp-simulation--toolbox',
      title: 'I am a popup title',
      body: 'I am a popup body',
    },
  ],
};
