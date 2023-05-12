import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  blcakListedUsers: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  pendingWithDrawels: {
    type: Number,
    default: 0,
  },
  solidConnect: {
    type: Number,
    default: 0,
  },
  balance: { 
     type: Number,
     default: 0 
    },
  inEsCrow: [
    {
      employer: {
        type: mongoose.Schema.Types.ObjectId,
      },
      employee: {
        type: mongoose.Schema.Types.ObjectId,
      },
      inEscrow: {
        type: Number,
      },
      proposal: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
