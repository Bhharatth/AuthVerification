// REGISTER USER

//@DEC  => users can register
//@METHOD => post
//@PATH => /register
import AsyncHandler from "express-async-handler";
import verificationToken from "../models/userVerificationModel.js";
import { generateOtp } from "../utils/getOtp.js";
import User from "../models/userModel.js";
import generateToken from "../utils/jsonwebtoken.js";
import { isValidObjectId } from "mongoose";
import Employee from "../models/employeeModel.js";
import Employer from "../models/employerModel.js";

export const regsiterUser = AsyncHandler(async (req, res) => {
  const { email, name, password, userType } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    if (!user.emailVerified) {
      user.name = name;
      user.email = email;
      user.password = password;
      user.userType = userType;

      const token = verificationToken.findByIdAndDelete({ owner: user._id });

      const OTP = generateOtp();

      const verificationtoken = new verificationToken({
        owner: user._id,
        token: OTP,
      });

      await verificationtoken.save();
      await user.save();

      // sendMail({});
    } else {
      res.status(404);
      throw new Error("Email already in use");
    }
  } else {
    const newUser = new User({
      name,
      email,
      password,
      userType,
    });

    const OTP = generateOtp();

    const verificationtoken = new verificationToken({
      owner: newUser._id,
      token: OTP,
    });

    await verificationtoken.save();
    await newUser.save();

    // sendEmail({})

    res.json(newUser);
  }
});

//USER LOGIN

//@DEC  => users can login
//@METHOD => post
//@PATH => /login

export const userLogin = AsyncHandler(async (req, res) => {
  const { email, password } = rew.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (user.userType === "employee") {
      res.json({
        _id: user._id,
        name: user.username,
        email: user.email,
        userType: user.userType,
        employeeData: user.employeeData,
        isBlocked: user.isBloked,
        token: generateToken(user._id),
      });
    } else if (user.userType === "employer") {
      res.json({
        _id: user._id,
        name: user.username,
        email: user.email,
        userType: user.userType,
        employerData: user.employerData,
        isBlocked: user.isBloked,
        token: generateToken(user._id),
      });
    } else if (user.userType === "admin") {
      res.json({
        _id: user._id,
        name: user.username,
        email: user.email,
        userType: user.userType,
        employerData: user.employerData,
        isBlocked: user.isBloked,
        token: generateToken(user._id),
      });
    }
  } else {
    res.status(404);
    throw new Error("Email or password is incorrect");
  }
});

//FERIFY EMAIL

//@DEC  =>
//@METHOD => post
//@PATH => / verify-email

export const verifyEmail = AsyncHandler(async (req, res) => {
  const { userId, otp, userType } = req.body;

  if (!userId || !otp.trim()) {
    throw new Error("invalid Request");
  }
  if (isValidObjectId(userId)) {
    throw new Error("invalid Request");
  } else {
    const user = await User.findbyId(userId);
    if (!user) {
      throw new Error("This account is verified or not fonud");
    }
    if (user.emailVerified) {
      throw new Error("Email alredy verified");
    }
    const token = await verificationToken.findById({ owner: userId });
    if (!token) {
      throw new Error("No token found");
    }
    const isMatch = await otp.matchPassword(token);

    if (!isMatch) {
      throw new Error("invalid otp");
    } else {
      user.emailVerified = true;
      await verificationToken.findById({ owner: userId });

      if (user.userType === "employee") {
        const userData = new Employee({
          owner: user._id,
        });

        user.employeeData = userData._id;
        userData.save();
        user.save();

        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          employeeData: user.employeeData,
          emailVerified: user.emailVerified,
          token: generateToken(user._id),
        });
      }
      if (user.userType === "employer") {
        const userData = new Employer({
          owner: user._id,
        });
        user.employerData = userData._id;
        userData.save();
        user.save();

        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          employerData: user.employerData,
          emailVerified: user.emailVerified,
          token: generateToken(user._id),
        });
      }
    }
  }
});

////@DEC  =>CHANGE
//@METHOD => post
//@PATH => /resetpassword/:userId

export const changePassword = AsyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = User.findById(userId);
    if (user && (await user.matchPasswords(oldPassword))) {
      user.newPassword = newPassword;
      await user.save();
      res.status(200).json({ message: "Password changed SuccessFully" });
    } else {
      res.status(401).json({ message: "Invalid Credentails" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

////@DEC  =>FORGOT PASSWORD
//@METHOD => post
//@PATH =>

export const forgotPassword = AsyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      $and: [{ email: email }, { emailVerified: true }],
    });

    if (user) {
      //deleting exsting token
      const token = await verificationToken.findByIdAndDelete({
        owner: user._id + "*",
      });

      const OTP = generateOtp();
      //generate new token
      const Token = new verificationToken({
        owner: user._id + "*",
        token: OTP,
      });

      sendMail({
        to: user.email,
        from: "admin@gmial.com",
        subject: `RESET PASSWORD`,
        html: `<div>
    <h1>RESET YOUR PASSWORD</h1>
    <p>Do not share your OTP with any one</p>
    <h3>OTP: <strong>${OTP}</strong></h3> 
    </div>`,
      });

      await user.save();
      await Token.save();
      res.status(200).json("Password reset success");
    } else {
      res.json("No user found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

//@DEC  =>FORGOT PASSWORD AND VERIFY
//@METHOD =>
//@PATH =>

export const forgotPasswordAndVerify = AsyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;

  const user = await User.findOne({ email: email });
  const id = user._id + "*";

  const token = await verificationToken.findOne({ owner: id });
  if (!token) {
    throw new Error("no token");
  }
  const isMatch = await token.matchPasswords(otp);

  if (user && isMatch) {
    user.password = password;
    await user.save();
    await verificationToken.findOneAndDelete({ owner: id });//
    res.json("success");
  } else {
    await verificationToken.findOneAndDelete({ owner: id });
    res.json("failed operation");
  }
});
