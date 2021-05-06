import {
  LessonStepArchetype,
  LessonPopupStepArchetype,
} from '../lessons/framework/LessonArchetype';

export const isPopupStep = (
  step: LessonStepArchetype
): step is LessonPopupStepArchetype => step.type === 'popup';
