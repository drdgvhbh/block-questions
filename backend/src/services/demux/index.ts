import { BaseActionWatcher } from 'demux';
import { MongoActionReader } from 'demux-eos';

import { ActionHandler } from './actionHandler';

import { effectors, updaters } from '../../questions';

const actionHandler = new ActionHandler([
  {
    effects: [...effectors],
    updaters: [...updaters],
    versionName: 'v1',
  },
]);

const STARTING_BLOCK = 3;

const actionReader = new MongoActionReader(
  'mongodb://127.0.0.1:27017',
  STARTING_BLOCK,
  false,
  Number.MAX_SAFE_INTEGER,
  'EOS',
);

const BLOCK_INTERVAL = 250;
const actionWatcher = new BaseActionWatcher(
  actionReader,
  actionHandler,
  BLOCK_INTERVAL, // Poll at twice the block interval for less latency
);

export { actionWatcher, actionReader };
