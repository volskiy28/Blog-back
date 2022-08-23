import express from "express";
import mongoose from "mongoose";
import {
  loginValidator,
  postCreateValidator,
  registerValidator,
} from "./validations/validations.js";
import { checkAuth, handleValidationErors } from "./utils/index.js";
import { UserController, PostController } from "./controllers/index.js";
import multer from "multer";
import cors from "cors";

mongoose
  .connect(
    "mongodb+srv://admin:bMVS3gyW0HZLWfJn@cluster0.mlrlfhw.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log("Error", err);
  });

const app = express();
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post(
  "/register",
  registerValidator,
  handleValidationErors,
  UserController.register
);
app.post("/auth/login", loginValidator, handleValidationErors, UserController.login);
app.get("/auth/me", checkAuth, UserController.getMe);
app.get("/tags", PostController.getLastTags);
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidator, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
