import { boundMethod } from 'autobind-decorator';
import mongoose from 'mongoose';
import { Schema } from '../questions';
import { Question } from '../questions/question';

export class QuestionRepository {
  public constructor(private model: mongoose.Model<Schema, {}>) {}

  @boundMethod
  public async getQuestion(args: {
    id: string;
  }): Promise<Question | undefined> {
    const { id } = args;

    const result = await this.model.findById(id);
    if (!result) {
      return undefined;
    }

    const { id: id_, author, title, content } = result;

    return new Question(id_, author, title, content);
  }

  @boundMethod
  public async getQuestions(): Promise<Question[]> {
    const result = await this.model.find();

    return result.map(
      ({ id: id_, author, title, content }) =>
        new Question(id_, author, title, content),
    );
  }
}
