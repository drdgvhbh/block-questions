import { IndexState } from 'demux';
import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface IBlockIndexState extends mongoose.Document, IndexState {
  isReplay: boolean;
}

const blockIndexStateSchema = new Schema({
  blockHash: String,
  blockNumber: Number,
  isReplay: Boolean,
});

export const blockIndexState = mongoose.model<IBlockIndexState>(
  'BlockIndexState',
  blockIndexStateSchema,
);
