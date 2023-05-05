import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  image: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  totalEarned: {
    type: Number,
    default: 0,
  },
  languages: {
    type: Array,
  },
  educations: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Educations",
  },
  skills: [],
  experiance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Experiance",
  },
  portFolios: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Portfolio",
  },
  connects: {
    type: Number,
    default: 50,
  },
  userTitle: {
    type: String,
    default: "please add a title",
  },
  userInfo: {
    type: String,
  },
  compleatedJobs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  kyc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Kyc",
  },
  kycApproved: {
    type: String,
    default: "pending",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  reported: {
    type: Number,
    default: 0,
  },
  activeContracts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  myProposals: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proposal",
  },
  pendingWithDraw: {
    type: Number,
    default: 0
  },
  availableForWithDraw: {
   
  },
  savedJobd: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  bankDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankDetails",
  },
  notification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notification",
  },
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
