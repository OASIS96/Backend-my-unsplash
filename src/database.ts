import mongoose from "mongoose";
import { environments } from "./environments/environments";

const options: mongoose.ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const database = async () => {
  await mongoose.connect(environments.DB_URI, options);
  console.log("Database is Connected");
};

database();

export default database;
