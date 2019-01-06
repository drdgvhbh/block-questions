// tslint:disable:prefer-function-over-method

import debug from 'debug';
import {
  AbstractActionHandler,
  Block,
  Effect,
  HandlerVersion,
  IndexState,
  Updater,
} from 'demux';
import mongoose from 'mongoose';
import { BlockIndexState, Post } from '../../models';
import { Model as QuestionModel } from '../../questions';
import * as io from '../../utils/io';
import { IBlogState, IContext } from './types';

class ActionHandler extends AbstractActionHandler {
  public constructor(handlerVersions: HandlerVersion[], uri: string) {
    super(handlerVersions);
    /*     mongoose.connect(uri);

    // CONNECTION EVENTS
    // Connection successful
    mongoose.connection.on('connected', () => {
      debug('info')(`Mongoose default connection open to ${uri}`);
    });

    // Connection throws an error
    mongoose.connection.on(
      'error',
      console.trace.bind(console, 'Mongoose default connection error:'),
    );

    // Connection is disconnected
    mongoose.connection.on('disconnected', () => {
      debug('info')('Mongoose default connection disconnected');
    });

    // Close the connection if the node process is terminated
    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        debug('info')(
          'Mongoose default connection disconnected through app termination',
        );
        process.exit(0);
      });
    }); */
  }

  protected async handleWithState(
    handle: (state: IBlogState, context?: IContext) => void,
  ): Promise<void> {
    const context = {
      socket: io.getSocket(),
    };
    const state = {
      blockIndexState: BlockIndexState,
      post: Post,
      question: QuestionModel,
    };
    // Console.log(state, context, '???');
    // Console.log('handle!');
    await handle(state, context);
  }

  protected async loadIndexState(): Promise<IndexState> {
    console.log('WTF?');
    let blockHash;
    let blockNumber;
    // Const indexState = await BlockIndexState.findOne({}).exec();
    /*     console.log(indexState, '??');
    if (indexState) {
      ({ blockHash, blockNumber } = indexState);
    }
    if (blockNumber && blockHash) {
      return {
        blockHash,
        blockNumber,
        handlerVersionName: 'v1',
        isReplay: false,
      };
    } */

    return {
      blockHash: '',
      blockNumber: 3,
      handlerVersionName: 'v1',
      isReplay: false,
    };
  }

  protected rollbackTo(blockNumber: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  protected async updateIndexState(
    state: IBlogState,
    block: Block,
    isReplay: boolean,
  ) {
    // Console.log(block);
    /*     const { blockInfo } = block;
    await state.blockIndexState
      .update(
        {},
        {
          blockHash: blockInfo.blockHash,
          blockNumber: blockInfo.blockNumber,
          isReplay,
        },
        {
          upsert: true,
        },
      )
      .exec(); */
  }
}

export { ActionHandler };
