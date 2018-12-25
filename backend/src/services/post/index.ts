import { Request, Response } from 'express';
import { Post } from '../../models';

/**
 * Get list of all posts confirmed by the blockchain
 */
export const listConfirmed = async (req: Request, res: Response) => {
  const confirmedPosts = await Post.find({ postConfirmed: true }).exec();
  res.send(confirmedPosts);
};
