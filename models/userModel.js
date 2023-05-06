import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
        type: String,
        required: true,
      },
      userType: {
        type: String,
        required: true,
      },
      emailVerified:{
        type: Boolean,
        default: false,
        required: true,
      },
      employeeData:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"

      },
      employerData:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employer"

      },
      AdminData:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"

      },
      isBloked: {
        type: Boolean,
        default: false,
      },
      reported:{
        type:Number,
        default: 0
      }
  
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async (enterdPassword)=> {
    return await bcrypt.compare(enterdPassword, this.password)
}

userSchema.pre("save", async (next)=> {
    if (!this.isModified("password")) {
        next();
    } 
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model("User", userSchema);
export default User;