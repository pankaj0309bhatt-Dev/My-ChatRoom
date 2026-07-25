import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  nickname: string;
  text: string;
  timestamp: Date;
}

const MessageSchema: Schema = new Schema({
  nickname: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IMessage>('Message', MessageSchema);