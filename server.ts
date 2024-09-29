import "module-alias/register";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import apiVersionRouter from "@routes/api/apiVersionRouter";
import passport from "passport";
import { reminderJob } from "@jobs/reminderJob";

dotenv.config();
const port = process.env.PORT;

const app = express();

app.use(express.json({ type: "application/json" }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use("/api", apiVersionRouter);

mongoose
  .connect("mongodb://localhost:27017/mydatabase")
  .then(() => console.log("MongoDB Connected!"));

app.listen(port, () => {
  console.log(`Listening On Port ${port}`);
});

reminderJob.start();
