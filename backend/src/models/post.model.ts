import mongoose from 'mongoose';

const { Schema } = mongoose;

let post: mongoose.Model<mongoose.Document>;

try {
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
  post = mongoose.model('Post', postSchema);
} catch (e) {
  post = mongoose.model('Post');
}

export { post };
