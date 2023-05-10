import AsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Jobs from "../models/jobModel.js";

// @DESC gets the profile of the admin
// @METHOD get
// @PATH /admin/profile

export const adminProfile = AsyncHandler(async (req, res) => {
  try {
    const user = await User.findById("12345")
      .populate("AdminData")
      .populate({
        path: "AdminData",
        populate: [{ path: "blcakListedUsers", select: " -_id" }],
      });

    let employee = 0;
    let employer = 0;

    const Jobs = await Jobs.find();
    const users = await User.find({});

    users.map((e) => {
      if (e.userType === "employer" && e.emailVerified) {
        employer++;
      } else if (e.userType === "employee" && e.emailVerified) {
        employee++;
      }
    });

    if (user) {
      res.status(200).json({
        adminData: user,
        employeeLength: employee,
        employerLength: employer,
        jobsLength: Jobs.length,
      });
    }
  } catch (error) {
    res.status(403);
    throw new Error(error);
  }
});

// @DESC gets the profile of all employees profile data for admin
// @METHOD get
// @PATH /admin/allEmployees
// @QUERY keyword(name of the user)

export const findAllEMployees = AsyncHandler(async (req, res) => {
  const keyword = req.query.keyword;

  const query = keyword
    ? {
        name: {
          $regex: keyWord,
          $options: "i",
        },
      }
    : {};

  try {
    const allEmployees = await User.find({
      ...query,
      userType: "employee",
      emailVerified: true,
    }).populate("employeeData");
    res.status(200).json(allEmployees);
  } catch (error) {
    res.status(403);
    throw new Error(error);
  }
});

// @DESC gets the profile of all employers profile data for admin
// @METHOD get
// @PATH /admin/allEmployers
// @QUERY keyword(name of the user)

export const getAllEmployers = AsyncHandler(async (req, res) => {
  const keyword = req.query.keyword;

  const query = keyword
    ? {
        name: {
          $regex: keyword,
          $options: "i",
        },
      }
    : {};

  try {
    const allEmployers = await User.find({
      ...query,
      userType: "employer",
      emailVerified: true,
    }).populate("employerData");
    res.status(200).json(allEmployers);
  } catch (error) {}
});
