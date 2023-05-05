import mongoose from "mongoose";

const bankDetailsSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ifsc: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: Number,
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
});

const BankDetails = mongoose.model("BankDetails", bankDetailsSchema);
export default BankDetails;
