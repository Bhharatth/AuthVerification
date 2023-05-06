// REGISTER USER

//@DEC  => users can register
//@METHOD => post
//@PATH => /register
import AsyncHandler from "express-async-handler";
import verificationToken from "../models/userVerificationModel.js";
import { generateOtp } from "../utils/getOtp.js";
import User from "../models/userModel.js";
import generateToken from "../utils/jsonwebtoken.js";

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
