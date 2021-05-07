import mongoose from 'mongoose';
import { SimulationSaveData } from '../common/database/SimulationSaveData';

type SimulationSaveDocument = SimulationSaveData & mongoose.Document;

const SimulationSaveSchema = new mongoose.Schema<SimulationSaveDocument>(
  {
    snapshot: { type: mongoose.Schema.Types.Mixed, required: true },
    username: { type: String, required: true },
  },
  { timestamps: true, minimize: false }
);

export const SimulationSaveModel = mongoose.model<SimulationSaveDocument>(
  'SimulationSave',
  SimulationSaveSchema
);
