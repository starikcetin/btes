import mongoose from 'mongoose';
import { UserData } from '../common/database/UserData';

type UserDocument = UserData & mongoose.Document;

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);