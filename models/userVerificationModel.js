import mongoose from "mongoose";

const verificationTokenSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      expires: 3600,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

verifyTokenSchema.methods.matchPasswords = async (token) => {
  return await bcrypt.compare(token, this.Token);
};

verifyTokenSchema.pre("save", async (next) => {
  if (!this.isModified("token")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.token = await bcrypt.hash(this.token, salt);
});

const verificationToken = mongoose.model("verificationToken", verificationTokenSchema);
export default verificationToken;
