import { BlockInfo } from 'demux';
import { IBlogState, IContext } from '../../types';

function createPost(
  state: IBlogState,
  payload: any,
  blockInfo: BlockInfo,
  context: IContext,
) {
  const post = {
    _id: {
      author: payload.data.author,
      timestamp: payload.data.timestamp,
    },
    author: payload.data.author,
    content: payload.data.content,
    tag: payload.data.tag,
    title: payload.data.title,
  };
  context.socket.emit('createpost', post);
}

export default createPost;
