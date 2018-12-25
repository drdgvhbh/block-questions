import { BlockInfo } from 'demux';
import { IBlogState, IContext } from '../../types';

async function createPost(
  state: IBlogState,
  payload: any,
  blockInfo: BlockInfo,
  context: IContext,
) {
  const Post = state.post;

  const duplicatePosts = await Post.find({
    _id: {
      author: payload.data.author,
      timestamp: payload.data.timestamp,
    },
  }).exec();

  // If post already exists do not insert it in again
  if (duplicatePosts.length !== 0) {
    return;
  }

  const post = new Post({
    _id: {
      author: payload.data.author,
      timestamp: payload.data.timestamp,
    },
    author: payload.data.author,
    content: payload.data.content,
    postConfirmed: true,
    tag: payload.data.tag,
    title: payload.data.title,
  });
  await post.save();
}

export default createPost;
