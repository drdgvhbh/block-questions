import mongoose from 'mongoose';
import { IBlockIndexState } from '../../../models';
import { IPostSchema } from '../../../models/post.model';

export interface IContext {
  socket: SocketIO.Server;
}

export interface IState {
  blockIndexState: mongoose.Model<IBlockIndexState>;
}

export interface IBlogState extends IState {
  post: mongoose.Model<IPostSchema>;
}
