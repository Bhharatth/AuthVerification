import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  school: {
    type: String,
  },
  title: {
    type: String,
  },
  period: {
    type: String,
  },
});

const Educations = mongoose.model("Educations", educationSchema);
export default Educations;
