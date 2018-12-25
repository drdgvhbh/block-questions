import { BlockInfo } from 'demux';
import { IBlogState, IContext } from '../../types';

async function likePost(
  state: IBlogState,
  payload: any,
  blockInfo: BlockInfo,
  context: IContext,
) {
  await state.post
    .findByIdAndUpdate(
      { timestamp: payload.data.timestamp, author: payload.data.author },
      { $inc: { likes: 1 } },
    )
    .exec();
}

export default likePost;
