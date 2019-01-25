import crypto from 'crypto';
import { BlockInfo, Updater } from 'demux';
import { EosPayload } from 'demux-eos';
import { Model as Question, QuestionState, Schema } from '../models/question';

interface CreateQuestionPayload extends EosPayload {
  data: {
    author: string;
    content: string;
    title: string;
  };
}

export class CreateQuestionUpdater implements Updater {
  public actionType: string;

  public constructor(actionType: string) {
    this.actionType = actionType;
  }

  // tslint:disable-next-line:prefer-function-over-method
  public async apply(
    state: QuestionState,
    payload: CreateQuestionPayload,
    blockInfo: BlockInfo,
    context: {},
  ): Promise<void> {
    const {
      data: { author, title, content },
    } = payload;
    const id = crypto
      .createHash('sha256')
      .update(`${author}${title}${content}`)
      .digest('hex');

    const schema: Partial<Schema> = {
      _id: id,
      author,
      content,
      title,
    };

    console.log(blockInfo.blockNumber);

    await new Promise<Schema | null>((res, rej) => {
      Question.findOneAndUpdate(
        { _id: id },
        schema,
        { upsert: true, new: true },
        (err, doc) => {
          if (err) {
            rej(err);
          }
          console.log(doc);
          res(doc);
        },
      );
    });
  }
}
