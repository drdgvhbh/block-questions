import mongoose from 'mongoose';

const { Schema } = mongoose;

const blockIndexStateSchema = new Schema({
  blockHash: String,
  blockNumber: Number,
  isReplay: Boolean,
});

export const blockIndexState = mongoose.model(
  'BlockIndexState',
  blockIndexStateSchema,
);
