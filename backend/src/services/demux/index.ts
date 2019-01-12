import { BaseActionWatcher, Effect } from 'demux';
import { MongoActionReader } from 'demux-eos';

import { ActionHandler } from './actionHandler';

import { updaters as updaters2 } from '../../questions';
import effects from './effects';
import updaters from './updaters';

export class CreateQuestionEffector implements Effect {
  public actionType: string;

  public constructor(contractAccount: string) {
    this.actionType = `boardaccount::postquestion`;
  }

  // tslint:disable-next-line:prefer-function-over-method
  public async run(payload: any, blockInfo: any, context: any): Promise<void> {
    console.log('effect');
    // Console.log(payload);
  }
}

const actionHandler = new ActionHandler(
  [
    {
      effects: [new CreateQuestionEffector('derp')],
      updaters: [...updaters2],
      versionName: 'v1',
    },
  ],
  process.env.MONGODB_URL || 'mongodb_url required',
);

const actionReader = new MongoActionReader(
  'mongodb://127.0.0.1:27017',
  3,
  false,
  1000000,
  'EOS',
);

const BLOCK_INTERVAL = 250;
const actionWatcher = new BaseActionWatcher(
  actionReader,
  actionHandler,
  BLOCK_INTERVAL, // Poll at twice the block interval for less latency
);

export { actionWatcher, actionReader };
