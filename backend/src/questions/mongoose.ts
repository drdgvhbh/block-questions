import mongoose from 'mongoose';
import { MongooseState } from '../mongoose/state';

export interface Schema extends mongoose.Document {
  _id: string;
  author: string;
  content: string;
  title: string;
}

const schema = new mongoose.Schema({
  _id: String,
  author: String,
  content: String,
  title: String,
});

export interface QuestionState extends MongooseState {
  question: mongoose.Model<Schema>;
}

export const Model = mongoose.model<Schema>('Question', schema, 'questions');
