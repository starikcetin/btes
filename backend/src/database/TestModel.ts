import mongoose from 'mongoose';
import { TestData } from '../common/database/TestData';

type TestDataDocument = TestData & mongoose.Document;

const TestSchema = new mongoose.Schema<TestDataDocument>(
  {
    foo: { type: Number, required: true },
    bar: { type: String, required: true },
  },
  { timestamps: true }
);

export const TestModel = mongoose.model<TestDataDocument>('Test', TestSchema);
