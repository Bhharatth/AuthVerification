import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
  },
  level: {
    type: string,
    enum: ["easy", "intermediate", "advanced"],
    default: "easy",
  },
  budject: {
    min: 5,
    max: 100000,
  },
  searchTag: {
    type: Array,
    default: 1,
  },
  proposals: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proposal",
  },
  AcceptedProposals: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proposal",
  },
  status: {
    type: String,
    enum: ["active", "compleated", "cancelled", "running"],
    default: "active",
  },
  deadline: {
    type: Number,
    default: 0,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Jobs = mongoose.model("Jobs", jobSchema);
export default Jobs;
