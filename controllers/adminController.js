import AsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Jobs from "../models/jobModel.js";
import Employee from "../models/employeeModel.js";
import Employer from "../models/employerModel.js";
import Kyc from "../models/kycModel.js";
import Admin from "../models/adminModel.js";
import Withdraw from "../models/withDrawModel.js";
import Purchase from "../models/purchaseModel.js";

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
  } catch (error) {
    res.status(403);
    throw new Error(error);
  }
});

// @DESC gets all blocked users
// @METHOD get
// @PATH /admin/blockedUsers
// @QUERY keyword(name of the user)

export const getAllBlockedUsers = AsyncHandler(async (req, res) => {
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
    const blockedUsers = await User.find({
      ...query,
      isBloked: true,
    })
      .populate("AdminData")
      .populate("employerData")
      .populate("employeeData");

    if (blockedUsers) {
      res.send(201).json(blockedUsers);
    } else {
      res.status(200).json("no blocked users");
    }
  } catch (error) {
    res.status(203);
    throw new Error(error);
  }
});

// @DESC Admin can blocked users
// @METHOD post
// @PATH /admin/block/:id
// @PARAMS ID(id of the user)

export const blockUsers = AsyncHandler(async (req, res) => {
  const { _id } = req.params;
  try {
    const user = User.findById(_id);

    if (user.userType === "employee") {
      const employee = await Employee.findOne({ owner: _id });
      const newNotification = new Notification({
        owner: employee._id,
        message: "your account have been blocked",
      });

      employee.notification.push(newNotification._id);
      await newNotification.save();
      await employee.save();
    } else if (userType === "employer") {
      const employer = await Employer.findOne({ owner: _id });
      const newNotification = new Notification({
        owner: employer._id,
        message: "your account have been blocked",
      });
      employer.notification.push(newNotification._id);
      await newNotification.save();
      await employer.save();
    }
    user.isBloked !== user.isBloked;
    user.save();

    sendMail({
      to: user.email,
      from: "admin@gmail.com",
      subject: "update alert",
      html: `<div>
            <h1>User update alert<h1/>
            <p>your account have been blicked , contact admin for further infi<p/>
            <div/>`,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(403);
    throw new Error(error);
  }
});

// @DESC Admin can blacklist usesrs
// @METHOD post
// @PATH /admin/blacklist
// @PARAMS id(id of the bkacklisted user)

export const blacklistUsers = AsyncHandler(async (req, res) => {
  const { id } = req.body;

  try {
    const adminData = await Users.findById("12345").populate(
      "blackListedUsers"
    ); //default admin id
    let a = 0;

    //checking user will blacklisted wheater already in blacklisted users
    adminData.blacklistUsers.forEach((e) => {
      if (e + "*" === id + "*") {
        a = 2;
      }
    });

    if ((a = 0)) {
      await adminData.blacklistUsers.push(_id);
      adminData.save();
      res.status(201).json(adminData);
    } else {
      res.status(403).json("user already in blocked list");
    }
  } catch (error) {
    res.status(403);
    throw new Error(error);
  }
});

// @DESC Admin can remove  blacklist usesrs from list
// @METHOD put
// @PATH /admin/removeBlacklist
// @BODY id(id of the bkacklisted user)

export const removeBlacklistedUser = AsyncHandler(async (req, rea) => {
  const { id } = req.body;

  try {
    const adminData = await Admin.findOne({ owner: "12345" }).populate(
      "blackListedUsers"
    );

    const arr = adminData.blcakListedUsers.filter((e) => {
      return e + "." !== id + ".";
    });

    adminData.blcakListedUsers = arr;
    await adminData.save();
    res.status(201).json(adminData);
  } catch (error) {
    res.status(403);
    throw new Error(error);
  }
});

// @DESC Admin can get all kyc details created by employees
// @METHOD get
// @PATH /admin/allKyc

export const getALLKyc = AsyncHandler(async (req, res) => {
  try {
    const kycData = await Kyc.find({}).populate("owner");
    res.status(200).json(kycData);
  } catch (error) {
    res.status(403);
    throw new Error(error);
  }
});

// @DESC Admin can accept and reject kyc
// @METHOD post
// @PATH /admin/accetKyc
//@BODY id(id of the kyc) ,msg(reason for rejected), status(status of kyc "accepted", "rejected")

export const acceptAndRejectKyc = AsyncHandler(async (req, res) => {
  const { id, status, message } = req.body;

  const kycDetail = await Kyc.findOne({ owner: id });
  const userDetail = await Employee.findOne({ owner: id }).populate("owner");

  if (status === "accept") {
    if (kycDetail && userDetail) {
      const newNotification = new Notification({
        owner: id,
        message: "kyc accepted",
      });

      kycDetail.kycStatus = "accepted";
      userDetail.kycApproved = "accepted";
      userDetail.notification.push(newNotification._id);

      await kycDetail.save();
      await newNotification.save();
      await userDetail.save();

      sendMail({
        to: userDetail.owner.email,
        from: "admin@gmail.com",
        subject: "KYC UPDATE",
        html: ` <div>
        <h1>Kyc Status</h1>
                <p>Your kyc have been Accepted</p>
        </div>
      </html>`,
      });
    }
  } else if (status === "reject") {
    if (kycDetail && userDetail) {
      const newNotification = new Notification({
        owner: id,
        message: "Your Kyc rejected",
      });

      kycDetail.kycStatus = "rejected";
      userDetail.kycApproved = "accepted";
      userDetail.notification.push(newNotification._id);

      await kycDetail.save();
      await newNotification.save();
      await userDetail.save();

      sendMail({
        to: userDetail.owner.email,
        from: "admin@gmail.com",
        subject: "KYC UPDATE",
        html: ` <div>
        <h1>Kyc Status</h1>
                <p>Your kyc have been rejected</p>
        </div>
      </html>`,
      });
    }
  }
});

//get all with draw for admin

export const getAllWithDraw = AsyncHandler(async (req, res) => {
  try {
    const withdraw = await Withdraw.find().populate("owner");
    res.status(200).json(withdraw);
  } catch (error) {
    res.status(403);
    throw new Error(error);
  }
});

export const doWithDrawel = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const withDrawel = await Withdraw.findById(id);

    if (withDrawel) {
      withDrawel.status = "finished";
      await withDrawel.save();
      res.status(200).json(withDrawel);
    } else {
      res.json("some thing went wrong");
    }
  } catch (error) {
    res.status(403);
    throw new Error(error);
  }
});


//purchaseHistory 

export const purchaseHistory = AsyncHandler(async (req, res) => {
  try {
    const pageSize = 2;
    const page = Number(req.query.pageSize || 1);

    const history = await Purchase.find();

    const allData = [];
    history.forEach((e) => {
      e.details.map((d) => {
        allData.push(d);
      });
    });
    res.status(200).json(allData.reverse());
  } catch (error) {
    throw new Error(error);
  }
});


export const myhelpChats = AsyncHandler(async(req, res)=> {
  
})
