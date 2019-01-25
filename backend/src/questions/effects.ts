import { Block, Effect } from 'demux';

interface Data {
  author: string;
  content: string;
  title: string;
}

export class CreateQuestionEffector implements Effect {
  public actionType: string;

  public constructor(actionType: string) {
    this.actionType = actionType;
  }

  // tslint:disable-next-line:prefer-function-over-method
  public async run(
    payload: { data: Data },
    blockInfo: Block,
    context: {},
  ): Promise<void> {
    /** */
  }
}
