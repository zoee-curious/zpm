import mongoose from 'mongoose';

import { ITool } from '../types/tool.types.js';

const toolSchema = new mongoose.Schema<ITool>(
  {
    name: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    isLatest: {
      type: Boolean,
      required: true,
      default: false,
    },
    assetUrls: {
      type: Map,
      of: String,
    },
  },
  { timestamps: true },
);

toolSchema.index({ name: 1, version: 1 }, { unique: true });

export const Tool = mongoose.model<ITool>('Tool', toolSchema);
