import mongoose from 'mongoose';
import { SimulationSaveData } from '../common/database/SimulationSaveData';

type SimulationSaveDocument = SimulationSaveData & mongoose.Document;

const SimulationSaveSchema = new mongoose.Schema<SimulationSaveDocument>(
  {
    snapshot: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const SimulationSaveModel = mongoose.model<SimulationSaveDocument>(
  'SimulationSave',
  SimulationSaveSchema
);
