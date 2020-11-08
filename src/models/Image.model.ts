import { Schema, Document, model } from "mongoose";
import { IPhoto } from "./Photo.model";

export interface IImage extends Document {
  public_id: string;
  format: string;
  type: string;
  secure_url: string;
  photo: IPhoto;
}

const ImageSchema = new Schema(
  {
    public_id: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
    photo: {
      type: Schema.Types.ObjectId,
      ref: "photo",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model<IImage>("image", ImageSchema);
