import { Document } from 'mongoose';

export interface ITool extends Document {
  name: string;
  version: string;
  releaseDate: Date;
  isLatest: boolean;
  assetUrls: Map<string, string>;

  createdAt: Date;
  updatedAt: Date;
}

export interface IToolBody {
  name: string;
  version: string;
  releaseDate: Date;
  isLatest: boolean;
  assetUrls: Map<string, string>;
}

export interface IToolParams {
  action: string;
  name: string;
  version: string;
}
