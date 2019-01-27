import { ofType } from '@martin_hotell/rex-tils';
import * as fromActions from './actions';
import { ActionsObservable, Epic } from 'redux-observable';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { of, from } from 'rxjs';
import ScatterJS from 'scatterjs-core';

interface Dependencies {
  login(): Promise<ScatterJS.Account>;
  transact(actions: ScatterJS.Action[]): Promise<void>;
}

export const askQuestion: Epic<fromActions.Actions> = (
  action$: ActionsObservable<fromActions.Actions>,
  state: any,
  dependencies: Dependencies,
) =>
  action$.pipe(
    ofType(fromActions.ASK_QUESTION),

    mergeMap(({ payload: { title, content } }) =>
      from(
        new Promise<void>(async (res, rej) => {
          const { login, transact } = dependencies;

          try {
            const account = await login();
            await transact([
              {
                account: 'board',
                name: 'postquestion',
                authorization: [
                  {
                    actor: account.name,
                    permission: account.authority,
                  },
                ],
                data: {
                  author: account.name,
                  title,
                  content,
                },
              },
            ]);
            res();
          } catch (err) {
            rej(err);
          }
        }),
      ).pipe(
        map(() => {
          return fromActions.Actions.askQuestionSuccess();
        }),
        catchError((error) => of(fromActions.Actions.askQuestionFailure())),
      ),
    ),
  );
