import mongoose from "mongoose";

const employerSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  totalSpend: {
    type: Number,
    default: 0,
  },
  userType: {
    type: String,
    require: true
  },
  balance:{
    type: Number,
    default:0
  },
  contractPosted: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  activeJobs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  compleatedJobs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  notification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notification",
  },
  hires: {
    type: Number,
    def: 0,
  },
  reported: {
    type: Number,
    default: 0,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  savedTalents: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Employer = mongoose.model("Employer", employerSchema);
export default Employer;
