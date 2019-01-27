import { combineEpics } from 'redux-observable';
import { askQuestionEpic } from './questions';

export const rootEpic = combineEpics(askQuestionEpic);
