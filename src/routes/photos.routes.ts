import { Router } from "express";
import {
  deletePhoto,
  getPhotos,
  uploadPhoto,
} from "../controllers/photos.controller";
import multerMiddle from "../middlewares/multer.middleware";

const router = Router();

//Routes
router.get("/", getPhotos);
router.post("/", multerMiddle.single("image"), uploadPhoto);
router.delete("/:_id", deletePhoto);

export default router;
