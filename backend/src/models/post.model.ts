import mongoose from 'mongoose';

const { Schema } = mongoose;

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

export const post = mongoose.model('Post', postSchema);
