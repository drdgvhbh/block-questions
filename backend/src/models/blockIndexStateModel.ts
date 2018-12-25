import mongoose from 'mongoose';

const { Schema } = mongoose;

let blockIndexState: mongoose.Model<mongoose.Document>;

try {
  const blockIndexStateSchema = new Schema({
    blockHash: String,
    blockNumber: Number,
    isReplay: Boolean,
  });
  blockIndexState = mongoose.model('BlockIndexState', blockIndexStateSchema);
} catch (e) {
  blockIndexState = mongoose.model('BlockIndexState');
}

export { blockIndexState };
