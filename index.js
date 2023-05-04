import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
const app = express();
app.use(cors());
dotenv.config();

mongoose.set("strictQuery", true);

const connect = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      })
      .then(console.log("Connected to mongoDB."));
  } catch (error) {
    throw error;
  }
};
mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});


app.use(express.json());


app.listen(5000, () => {
    connect();
    console.log("Connected to backend.");
  });