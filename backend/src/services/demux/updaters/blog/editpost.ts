import { BlockInfo } from 'demux';
import { IBlogState, IContext } from '../../types';

async function editPost(
  state: IBlogState,
  payload: any,
  blockInfo: BlockInfo,
  context: IContext,
) {
  try {
    await state.post
      .findByIdAndUpdate(
        { timestamp: payload.data.timestamp, author: payload.data.author },
        payload.data,
      )
      .exec();
  } catch (err) {
    console.trace(err);
  }
}
export default editPost;
