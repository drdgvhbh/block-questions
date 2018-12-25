import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface IPostSchema extends mongoose.Document {
  _id: {
    author: string;
    timestamp: number;
  };
  author: string;
  content: string;
  likes: {
    default: number;
    type: number;
  };
  postConfirmed: {
    default: boolean;
    type: boolean;
  };
  tag: string;
  title: string;
}

const postSchema = new Schema({
  _id: {
    author: String,
    timestamp: Number,
  },
  author: String,
  content: String,
  likes: {
    default: 0,
    type: Number,
  },
  tag: String,
  title: String,

  postConfirmed: {
    default: false,
    type: Boolean,
  },
});

export const post = mongoose.model<IPostSchema>('Post', postSchema);
