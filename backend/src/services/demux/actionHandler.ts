// tslint:disable:prefer-function-over-method

import { AbstractActionHandler, Block } from 'demux';
import mongoose from 'mongoose';
import { BlockIndexState, IBlockIndexState } from '../../models';
import {
  Model as QuestionModel,
  Schema as QuestionSchema,
} from '../../questions';

interface StateHistory {
  [key: number]: any;
}

interface State {
  blockIndexState: mongoose.Model<IBlockIndexState, {}>;
  indexState: {
    blockHash: string;
    blockNumber: number;
    handlerVersionName: string;
    isReplay: boolean;
  };
  question: mongoose.Model<QuestionSchema, {}>;
  totalTransfers: 0;
  volumeBySymbol: { [key: string]: any };
}

class ActionHandler extends AbstractActionHandler {
  private context = {};
  private state: State = {
    blockIndexState: BlockIndexState,
    indexState: {
      blockHash: '',
      blockNumber: 3,
      handlerVersionName: 'v1',
      isReplay: false,
    },
    question: QuestionModel,
    totalTransfers: 0,
    volumeBySymbol: {},
  };

  private stateHistory: StateHistory = {};

  private stateHistoryMaxLength = Number.MAX_SAFE_INTEGER;

  public async loadIndexState() {
    return this.state.indexState;
  }

  public async rollbackTo(blockNumber: number) {
    const { blockNumber: latestBlockNumber } = this.state.indexState;
    const toDelete = [...Array(latestBlockNumber - blockNumber).keys()].map(
      (n) => n + blockNumber + 1,
    );
    for (const n of toDelete) {
      delete this.stateHistory[n];
    }
    this.state = this.stateHistory[blockNumber];
  }

  public async updateIndexState(
    state: State,
    block: Block,
    isReplay: boolean,
    handlerVersionName: string,
  ) {
    state.indexState = {
      blockHash: block.blockInfo.blockHash,
      blockNumber: block.blockInfo.blockNumber,
      handlerVersionName,
      isReplay,
    };
  }

  protected async handleWithState(
    handle: (state: any, context?: any) => void,
  ): Promise<void> {
    await handle(this.state, this.context);
    const { blockNumber } = this.state.indexState;
    this.stateHistory[blockNumber] = JSON.parse(JSON.stringify(this.state));
    if (
      blockNumber > this.stateHistoryMaxLength &&
      this.stateHistory[blockNumber - this.stateHistoryMaxLength]
    ) {
      delete this.stateHistory[blockNumber - this.stateHistoryMaxLength];
    }
  }
}

export { ActionHandler };
