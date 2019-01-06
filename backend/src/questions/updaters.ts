import crypto from 'crypto';
import { BlockInfo, Updater } from 'demux';
import { EosPayload } from 'demux-eos';
import { Model as Question, QuestionState, Schema } from './model';

interface CreateQuestionPayload extends EosPayload {
  data: {
    author: string;
    content: string;
    title: string;
  };
}

export class CreateQuestionUpdater implements Updater {
  public actionType: string;

  public constructor(contractAccount: string) {
    console.log('HELLO?');
    this.actionType = `boardaccount::postquestion`;
  }

  // tslint:disable-next-line:prefer-function-over-method
  public async apply(
    state: QuestionState,
    payload: CreateQuestionPayload,
    blockInfo: BlockInfo,
    context: any,
  ): Promise<void> {
    console.log('????');
    console.log('RETARDIOS');
    //  Console.log(payload);
    const { question } = state;
    const {
      data: { author, title, content },
    } = payload;
    const id = crypto
      .createHash('sha256')
      .update(`${author}${title}${content}`)
      .digest('hex');

    /*     const duplicateUserQuestions = await question
      .find({
        _id: id,
      })
      .exec();

    if (duplicateUserQuestions.length !== 0) {
      // TODO: do something with duplicate
      console.log('duplicate!', duplicateUserQuestions);
      return;
    }

    const schema: Partial<Schema> = {
      _id: id,
      author,
      content,
      title,
    };
    const newQuestion = new Question(schema);
    await newQuestion.save(); */
  }
}
