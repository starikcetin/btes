import mongoose from 'mongoose';
import { UserData } from '../common/database/UserData';

type UserDocument = UserData & mongoose.Document;

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    lessonData: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true, minimize: false }
);

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
