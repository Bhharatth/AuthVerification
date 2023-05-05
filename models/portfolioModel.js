import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  img: {
    type: String,
  },
  title: {
    type: String,
  },
  desc: {
    type: String,
    required: [true, "Please add a description"]
  },
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
export default Portfolio;
