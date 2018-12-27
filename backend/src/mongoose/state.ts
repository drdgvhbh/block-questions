import { IndexState } from 'demux';
import mongoose from 'mongoose';

export interface BlockIndexState extends mongoose.Document, IndexState {
  isReplay: boolean;
}

export interface MongooseState {
  blockIndexState: mongoose.Model<BlockIndexState>;
}
