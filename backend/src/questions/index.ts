import { CreateQuestionEffector } from './effects';
import { CreateQuestionUpdater } from './updaters';
export { Model, Schema } from './mongoose';
export const updaters = [new CreateQuestionUpdater('board::postquestqed')];

export const effectors = [new CreateQuestionEffector('board::postquestqed')];
