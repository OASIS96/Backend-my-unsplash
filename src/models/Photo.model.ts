import { Schema, Document, model } from "mongoose";
import { IImage } from "./Image.model";

export interface IPhoto extends Document {
  description: string;
  image: IImage;
}

const PhotoSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: "image",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model<IPhoto>("photo", PhotoSchema);
