import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

//parsing data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//enable cors
app.use(cors());

//static files
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "public/uploads"))
); //static files

//posts middleware
import postRoutes from "./routes/post.js";
app.use("/api/v1/posts", postRoutes);
//auth middleware
import authRoute from "./routes/auth.js";
app.use("/api/v1/auth", authRoute);

//connect to database
mongoose
  .connect("mongodb://127.0.0.1:27017/posts", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log("error while connecting to database");
  });

//home route
app.get("/", (req, res) => {
  res.send("hello world");
});
//create server
app.listen(3000, () => {
  console.log("server is running");
});
