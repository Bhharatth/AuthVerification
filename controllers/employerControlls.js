import AsyncHandler from "express-async-handler";
import Employee from "../models/employeeModel.js";
import Employer from "../models/employerModel.js";
import User from "../models/userModel.js";

//@DESC => GET ALL EMPLYERDATA
//@METHOD => GET
//@PATH => /employer/profile/:userId

export const getAllEmployerProfile = AsyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const userData = await Employer.findOne({ owner: userId })
      .populate("owner")
      .populate("savedTalents")
      .populate("notifications")
      .populate("compleatedJob")
      .populate({
        path: "savedTalents",
        populate: [
          { path: "employeedata", select: "image userTitle totalEarned _id" },
        ],
      });

    if (userData) {
      res.status(200).json(userData);
    }
  } catch (error) {
    throw new Error(error);
  }
});

//@DESC => GET  EMPLYERDATA
//@METHOD => GET
//@PATH => /employer/profile/:userId/:id

export const getEmployerProfileData = AsyncHandler(async (req, res) => {
  const { userId, id } = rea.params;

  try {
    const userData = await Employer.findOne({ owner: userId })
      .populate("owner")
      .populate("savedTalents")
      .populate("compleatedJobs")
      .populate({
        path: "savedTalents",
        populate: [
          {
            path: "employeeData",
            select: "image userTitle totalEarned _id",
          },
        ],
      });

    if (userData) {
      res.json(userData);
    } else {
      res.json({ message: "No profile found" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

//@DESC => EMPLOYERS CAN EDIT THEIRE PROFILE
//@METHOD => PUT
//@PATH => /employer/profile/:userId

export const editemployerProfile = AsyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, oldPass, newPass, image } = req.body;

  const user = await User.findbyId(id);
  const userData = await Employer.findOne({ owner: userId });

  if (user) {
    if (name) {
      user.username = name;
    }
    if (newPass && oldPass) {
      if (await user.matchPassword(oldPass)) {
        user.password = newPass;
      } else {
        res.status(404).json({ message: "Incorrect password" });
      }
    }

    if (image) {
      userData.image = image;
    }
    userData.save();
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "No user found" });
  }
});

//@DESC => EMPLOYEES CAN SEARCH ALL THE EMPLOYEES
//@METHOD => GET
//@PATH => /employer/allEmployees

export const getAllEmployees = AsyncHandler(async (req, res) => {
  const { keyword, earnings, language, jobdone, pagenumber } = req.query;
  try {
    const pageSize = 2;
    const page = Number(pagenumber) || 1;

    if (keyword || language || earnings || jobdone || pagenumber) {
      const allEmployees = await Employee.find({
        $or: [
          {
            "languages.language": {
              $regex: language ? language : "null",
              $options: "i",
            },
          },
          {
            "sklls.skill": {
              $regex: skill ? skill : "null",
              $options: "i",
            },
          },
          { totalEarned: { $lt: earnings ? earnings : "20" } },
        ],
      })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .populate("owner");

      res.json({
        allEmployees,
        page,
        pages: Math.ceil(allEmployees.length / pageSize),
      });
    } else {
      const count = await Employee.find({}).count({});
      const allEmployees = await Employee.find({})
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .populate("owner");
      res.status(200).json({
        allEmployees,
        page,
        pages: Math.ceil(count / pageSize),
      });
    }
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

//@DESC => EMPLOYEES CAN SAVE GOOD EMPLOYEES FOR LATER USE
//@METHOD =>
//@PATH => /employer/savedTalent/:userId

export const savedJobs = AsyncHandler(async (req, res) => {
  const { id } = req.body;
  const { userId } = req.params;

  try {
    const employerdata = await Employer.findOne({ owner: userId });

    let a = 0;
    employerdata.savedTalents.forEach((e) => {
      if (e + "*" === id + "*") {
        a = 2;
      }
    });

    if (a === 0) {
      employerdata.savedTalents.push(id);
      await employerdata.save();
      res.status(201).json(employerdata);
    }
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

//@DESC => EMPLOYER CAN REMOVE GOOD EMPLOYEES FROM SAVED LIST
//@METHOD => DELETE
//@PATH => /employer/savedTalents/:userId

export const removeTalent = AsyncHandler(async (req, res) => {
  const { id } = req.body;
  const { userId } = req.params;

  try {
    const employerData = await Employer.findOne({ owner: userId })
      .populate("owner")
      .populate("savedTalents")
      .populate({
        path: "savedTalents",
        populate: [
          {
            path: "employeeData",
            select: "image userTitle totalEarned _id",
          },
        ],
      });

    const arr = employerData.savedTalents.filter((e) => {
      return e._id + "." !== id + ".";
    });
    employerData.savedTalents = arr;
    await employerData.save();
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

//@DESC => DELETE EMPLOYER NOTIFICATION
//@METHOD => DELETE
//@PATH => /employer/deleteMessage/:userId/:id

export const deleteMessageEmployer = AsyncHandler(async (req, res) => {
  const { userId, id } = req.params;
  try {
    const user = await Employer.findOne({ owner: userId });
    const message = await Notification.findByIdAndDelete(id);

    const notifications = user.notification.filter((e) => {
      e._id + "*" !== id + "*";
    });
    user.notification = notifications;
    await user.save();
    res.status(200).json(notifications);
  } catch (error) {
    throw new Error(error);
  }
});
