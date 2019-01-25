import mongoose from 'mongoose';
import { Question } from '../entities/Question';
import { Schema } from '../questions';
import { boundMethod } from 'autobind-decorator';

export class QuestionRepository {
  constructor(private model: mongoose.Model<Schema, {}>) {}

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
}
