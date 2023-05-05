import mongoose from "mongoose";

const withDrawSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
});

const Withdraw = mongoose.model("Withdraw", withDrawSchema);
export default Withdraw;
