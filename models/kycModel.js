import mongoose from "mongoose";

const kycSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  adharImage: {
    type: String,
    required: [true,"please give adhar image"]
  },
  adharSelfie: {
    type: String,
    required: [true,"please give adhar selfie"]
  },
  panImage: {
    type: String,
    required: [true,"please give pan image"]
  },
  gstNumber: {
    type: String,
    required: [true,"please give gst Number"]
  },
  kycStatus: {
    type: String,
    default: "pending",
  },
});

const Kyc = mongoose.model("Kyc", kycSchema);
export default Kyc;
