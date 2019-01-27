import { createStore, applyMiddleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';
import logger from 'redux-logger';
import ScatterJS from 'scatterjs-core';
import { login, transact } from '@/scatter';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { rootEpic } from './rootEpic';

interface Dependencies {
  login(): Promise<ScatterJS.Account>;
  transact(actions: ScatterJS.Action[]): Promise<void>;
}

const epicMiddleware = createEpicMiddleware<any, any, any, Dependencies>({
  dependencies: {
    login,
    transact,
  },
});

const epic$ = new BehaviorSubject(rootEpic);
const hotReloadingEpic = (...args: any[]) =>
  epic$.pipe(switchMap<any, any>((epic) => epic(...args)));

export function configureStore(state = {}): Store {
  const store = createStore(
    () => ({}),
    state,
    composeWithDevTools(applyMiddleware(epicMiddleware, logger)),
  );

  epicMiddleware.run(hotReloadingEpic);

  if ((module as any).hot) {
    (module as any).hot.accept('./', () => {
      const nextRootEpic = require('./rootEpic').rootEpic;
      epic$.next(nextRootEpic);
    });
  }

  return store;
}
