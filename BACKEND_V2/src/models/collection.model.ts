import mongoose, { Schema, Document } from "mongoose";

export interface ICollection extends Document {
  identifier: string;
  name: string;
  year?: number;
  category: mongoose.Types.ObjectId;
  description: string;
  history: string;
  language?: string;
  creator?: string;
  subject?: string;
  publisher?: string;
  contributor?: string;
  copyright?: string;
  date?: Date;
  format?: string;
  identifierCode?: string;
  source?: string;
  museumEntryYear?: number;
  images?: { name: string; url: string }[];
  audio?: { name: string; url: string };
  createdBy: mongoose.Types.ObjectId;
}

const CollectionSchema = new Schema<ICollection>(
  {
    identifier: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    year: { type: Number },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    history: { type: String, required: true },

    language: { type: String },
    creator: { type: String },
    subject: { type: String },
    publisher: { type: String },
    contributor: { type: String },
    copyright: { type: String },
    date: { type: Date },
    format: { type: String },
    identifierCode: { type: String },
    source: { type: String },
    museumEntryYear: { type: Number },
    images: [{ name: String, url: String }],
    audio: { name: String, url: String },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICollection>("Collection", CollectionSchema);
