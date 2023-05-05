import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  details: {
    type: Array,
  },
 
});

const Purchase = mongoose.model("purchase", purchaseSchema);
export default Purchase;