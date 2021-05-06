import {
  LessonStepArchetype,
  LessonModalStepArchetype,
} from '../lessons/framework/LessonArchetype';

export const isModalStep = (
  step: LessonStepArchetype
): step is LessonModalStepArchetype => step.type === 'modal';
