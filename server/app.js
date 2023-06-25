import express from "express";
import User from "./routers/User.js";
import Post from "./routers/Post.js";
import Card from "./routers/Card.js";
import Utilities from "./routers/Utilities.js"
import Contract from "./routers/Contract.js"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
  })
);
app.use(cors());

app.use("/api/v1", User);
app.use("/api/v1", Post);
app.use("/api/v1", Card);
app.use("/api/v1", Utilities);
app.use("/api/v1", Contract);

app.get("/", (req, res) => {
  res.send("Server is working");
});
