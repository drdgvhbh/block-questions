import { BlockInfo } from 'demux';
import { IBlogState, IContext } from '../../types';

function likepost(
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
  context.socket.emit('likepost', post);
}

export default likepost;
