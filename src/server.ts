import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import PhotoRouter from "./routes/photos.routes";
import { environments } from "./environments/environments";
import Pusher from "pusher";

//Pusher Configuration
export const pusher = new Pusher({
  appId: "1103545",
  key: "b5119dada49563d92ee4",
  secret: "47dc6aea6d169134a5e6",
  cluster: "us2",
});

//App

const app = express();

//Configurations
app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/api/photos", PhotoRouter);

//Starting Server
app.listen(environments.PORT || 3000, () => {
  console.log(`Serve on port ${environments.PORT}`);
});

export default app;
