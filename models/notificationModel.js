import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
