import { BlockInfo } from 'demux';
import { IBlogState, IContext } from '../../types';

function deletePost(
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
  };
  context.socket.emit('deletepost', post);
}

export default deletePost;
