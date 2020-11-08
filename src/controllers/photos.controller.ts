import { Request, Response } from "express";
import cloudinary from "cloudinary";
import ImageSchema from "../models/Image.model";
import PhotoSchema from "../models/Photo.model";
import fs from "fs-extra";
import path from "path";
import { environments } from "../environments/environments";
import { pusher } from "../server";

const config: cloudinary.ConfigOptions = {
  cloud_name: environments.CLOUDINARY_CLOUD_NAME,
  api_key: environments.CLOUDINARY_API_KEY,
  api_secret: environments.CLOUDINARY_API_SECRET,
  provisioning_api_secret: "",
  provisioning_api_key: "",
};

export const getPhotos = async (req: Request, res: Response) => {
  const photos = await PhotoSchema.find().populate("image");
  return res.status(200).json(photos);
};

export const deletePhoto = async (req: Request, res: Response) => {
  cloudinary.v2.config(config);
  const { _id } = req.params;
  
  //Deleting Photo
  const photo = await PhotoSchema.findByIdAndDelete(_id);
  if (!photo) {
    return res.status(400).json({ error: "Photo doenst exist" });
  }
  //Deleting Image
  const image = await ImageSchema.findByIdAndDelete(photo.image);
  if (!image) {
    return res.status(400).json({ error: "Image doesnt exist" });
  }

  //Destroying photo file from cloudinary
  await cloudinary.v2.uploader.destroy(image.public_id);

  //Triggering event from pusher
  await pusher.trigger("my-unsplash-channel", "deleted_photo", {
    status: "Photo Deleted event triggered",
  });
  return res.status(200).json({ message: "Photo Deleted Succesfully" });
};

export const uploadPhoto = async (req: Request, res: Response) => {
  try {
    cloudinary.v2.config(config);
    const { description } = req.body;
    const {
      secure_url,
      format,
      public_id,
      type,
    } = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "My unsplash",
    });

    //Finding image in DB
    const newImage = new ImageSchema({ secure_url, format, public_id, type });
    const { _id } = await newImage.save();

    //Removing image from folder /tmp
    await fs.unlink(path.resolve("/tmp", req.file.filename));

    //Creating new Photo
    const newPhoto = new PhotoSchema({ description });
    const image = await ImageSchema.findById(_id);
    if (!image) {
      return res.status(400).json({ error: "Image doesnt upload correctly" });
    }

    //Finding image and updating photo property
    image.photo = newPhoto.id;
    await image?.save();
    newPhoto.image = _id;
    await newPhoto.save();

    //Triggering event of pusher
    await pusher.trigger("my-unsplash-channel", "new_photo", {
      status: "New Photo event triggered",
    });
    return res.status(200).json({ status: "Photo Created Successfully" });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};
