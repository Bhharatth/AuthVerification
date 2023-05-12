import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  bid: {
    type: Number,
    min: 0,
  },
  status: {
    type: String,
    enum: ["active", "shortListed", "rejected"],
    default: "active",

  },
  deadLine: {
    type: Number,
    default: 1,
  }
 
});

const Proposal = mongoose.model("Proposal", proposalSchema);
export default Proposal;