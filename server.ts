import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import apiVersionRouter from "./src/routes/api/apiVersionRouter";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: "application/json" }));

dotenv.config();
const port = process.env.PORT;

mongoose
  .connect("mongodb://localhost:27017/mydatabase")
  .then(() => console.log("Connected!"));
mongoose.Promise = global.Promise;

app.use("/api", apiVersionRouter);

app.listen(port, () => {
  console.log(`Listening On Port ${port}`);
});
