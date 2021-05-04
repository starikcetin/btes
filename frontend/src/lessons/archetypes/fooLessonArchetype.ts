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
      footer: 'I am a modal footer',
    },
    {
      type: 'popup',
      targetElementId: '#i-am-an-element-id',
      title: 'I am a popup title',
      body: 'I am a popp body',
    },
    {
      type: 'wait',
      waitType: 'socketEvent',
      socketEvent: 'simulation-node-created',
    },
    {
      type: 'popup',
      targetElementId: '#i-am-another-element-id',
      title: 'I am a popup title',
      body: 'I am a popp body',
    },
  ],
};
