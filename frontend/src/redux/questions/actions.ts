import { ActionsUnion, createAction } from '@martin_hotell/rex-tils';

export interface AskQuestionPayload {
  title: string;
  content: string;
}

export const ASK_QUESTION = 'POST_QUESTION';
export const ASK_QUESTION_SUCCESS = 'POST_QUESTION_SUCCESS';
export const ASK_QUESTION_FAILURE = 'POST_QUESTION_FAILURE';

export const Actions = {
  askQuestion: (payload: AskQuestionPayload) =>
    createAction(ASK_QUESTION, payload),
  askQuestionSuccess: () => createAction(ASK_QUESTION_SUCCESS),
  askQuestionFailure: () => createAction(ASK_QUESTION_FAILURE),
};

export type Actions = ActionsUnion<typeof Actions>;
