import { BlockInfo } from 'demux';
import { IBlogState, IContext } from '../../types';

async function deletePost(
  state: IBlogState,
  payload: any,
  blockInfo: BlockInfo,
  context: IContext,
) {
  try {
    await state.post
      .findByIdAndDelete({
        author: payload.data.author,
        timestamp: payload.data.timestamp,
      })
      .exec();
  } catch (err) {
    console.trace(err);
  }
}

export default deletePost;
