import AsyncHandler from "express-async-handler";
import Employee from "../models/employeeModel.js";
import Educations from "../models/educationModel.js";
import Kyc from "../models/kycModel.js";
import BankDetails from "../models/bankDetailsModel.js";
import Portfolio from "../models/portfolioModel.js";
import Notification from "../models/notificationModel.js";

//@DESC => get all info of employee
//PATH => /employee/profile/:id

export const employeeProfile = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { education } = req.body;

  try {
    const userData = await Employee.findOne(id)
      .populate("educations")
      .populate("portfolios")
      .populate("owner")
      .populate("activeContract")
      .populate("notification")
      .populate("savedJobs")
      .populate("coompleatedJobs");

    if (userData) {
      res.status(200).json(userData);
    } else {
      res.status(404).json("No user found");
    }
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

//@DESC => employees can post their education
//@METHOD => POST
//PATH => /employee/education/:userId

export const postEducation = AsyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { education } = req.body;

  try {
    const userData = await Employee.findOne({ owner: userId });

    if (education) {
      const educationData = new Educations({
        owner: education.owner,
        school: education.school,
        title: education.education,
        period: education.period,
      });
      userData.educations.push(educationData._id);
      await educationData.save();
      res.status(200).json(userData);
    }
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

//@DESC => employees can delete their education
//@METHOD => DELETE
//PATH => /employee/education/:userId/:id
//id as education id

export const deleteEducation = AsyncHandler(async (req, res) => {
  const { userId, id } = req.params;

  try {
    const userData = await Employee.findByIdAndUpdate(
      { owner: userId },
      { $pull: { educations: id } }
    );

    const deleteEducation = await Educations.findByIdAndDelete(id);

    res.status(201).json("Deleted SuccessFully");
  } catch (error) {
    res.json(404);
    throw new Error(error);
  }
});

//@DESC => employees can add language or skills
//@METHOD => POST
//PATH => /employee/editProfile/:userId

export const addLanguagesAndSkills = AsyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { skill, language } = req.body;

  try {
    const employeeData = await Employee.findOne({ owner: userId });

    if (skill) {
      employeeData.skills.push({ skill });
      await employeeData.save();
    }

    if (language) {
      employeeData.push.languages({ language });
      await employeeData.save();
    }

    res.status(201).json(employeeData);
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

//@DESC => employees can edit thier education
//@METHOD => PUT
//PATH => /employee/editInfo/:userId

export const editInfo = AsyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { title, info } = req.body;

  try {
    if (title) {
      const userData = await Employee.findByIdAndUpdate(
        { owner: userId },
        { userTitle: title }
      );
    }

    if (info) {
      const userData = await Employee.findByIdAndUpdate(
        { owner: userId },
        { userInfo: info }
      );
    }

    res.status(201).json({ message: "successfully updated" });
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

//@DESC => employees can edit delete languages or skill
//@METHOD => DELETE
//PATH => /employee/editProfile/:id

export const deleteLannguageOrSkill = AsyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { skill, language } = req.query;

  try {
    if (language) {
      const userdata = await Employee.findOneAndUpdate(
        { owner: userId },
        { $pull: { languages: { language: language } } }
      );

      if (skill) {
        const userData = await Employee.findByIdAndUpdate(
          { owner: userId },
          { $pull: { skils: { skill: skill } } }
        );
      }

      res.status(201).json({
        message: "Deleted successfully",
      });
    }
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

//@DESC => employees can add profile pic
//@METHOD => update
//PATH => /employee/profileImg/:userId

export const addProfileImage = AsyncHandler(async (req, res) => {
  const { img } = req.body;
  const { userId } = req.params;

  try {
    const userData = await Employee.findOne({ owner: userId });
    if (userData) {
      userData.image = img;
      userData.save();
    }
    res.status(201).json(userData);
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

//@DESC => employees can add kyc details
//@METHOD => post
//PATH => /employee/kyc/:userId

export const addKyc = AsyncHandler(async (req, res) => {
  const { adhar, adharSelfie, panImage, gstNumber } = req.body;
  const { userId } = req.params;

  try {
    const userData = await Employee.findById({ owner: userId });
    await Kyc.findByIdAndDelete({ owner: userData.id });

    const kycData = new Kyc({
      owner: owner,
      adharImage: adhar,
      adharSelfie: adharSelfie,
      panImage: panImage,
      gstNumber: gstNumber,
    });

    await kycData.save();

    userData.kyc = kycData._id;
    userData.status = "approved";

    res.status(200).json(userData);
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

//@DESC => employees can add thier bank details
//@METHOD => post
//PATH => /employee/addbank/:userId

export const addBankdetails = AsyncHandler(async (req, res) => {
  const { ifsc, accNum, accName } = req.body;
  const { userId } = req.params;

  try {
    const bankdetails = await BankDetails.findOne({ owner: userId });
    const userData = await Employee.findOne({ owner: userId });

    if (bankdetails) {
      res.status(200).send({ message: "Bank details exists" });
    } else {
      const Addbank = new BankDetails({
        owner: userId,
        ifsc: ifsc,
        accountNumber: accNum,
        accountName: accName,
      });
      await Addbank.save();
      userData.bankDetails = Addbank._id;
      await userData.save();
      res.status(201).json(Addbank);
    }
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

//@DESC => employees can add upto 4 portfolios
//@METHOD => post
//PATH => /employee/addPortFolio/:userId

export const addPortFolio = AsyncHandler(async (req, res) => {
  const { image, title, description } = req.body;
  const { userId } = req.params;

  try {
    const userData = await Employee.findOne({ owner: userId });

    if (userData) {
      const newPortFolio = new Portfolio({
        img: image,
        title: title,
        desc: description,
      });

      await newPortFolio.save();
      userData.portFolios.push(newPortFolio._id);
      await userData.save();
    }
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

//@DESC => employees can delete the kyc profile
//@METHOD => delete
//PATH => /employee/deletePortFolio/:userId
//id - portfolio id

export const deletePortFolio = AsyncHandler(async (req, res) => {
  const { id, userId } = req.params;

  try {
    const findUser = await Employee.findOne({ owner: userId });
    const findAndUpdateUser = await Employee.findOneAndUpdate(
      { owner: userId },
      { $pull: { portFolios: id } }
    );
    const deleteData = await Portfolio.findByIdAndDelete(id);
    res.status(200).json({
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

//@DESC => employees can save jobs
//@METHOD => get
//PATH => /employee/savedJobs/:userId/:id

export const savedJobs = AsyncHandler(async (req, res) => {
  const { id, userId } = req.params;

  try {
    const employeedata = await Employee.findById({ owner: userId });
    employeedata.savedJobs.forEach((e) => {
      if (e + "*" !== id + "*") {
        a = 2;
      }
      if (a == 0) {
        employeedata.savedJobs.push(id);
      }
    });
    await employeedata.save();
    res.status(200).json(employeedata);
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

//@DESC => employees can unsave jobs
//@METHOD => delete
//PATH => /employee/unsavedJobs/:userId/:id
//id - job id

export const removeSavedJobs = AsyncHandler(async (req, res) => {
  const { id, userId } = req.params;

  try {
    const employeeData = await Employee.findOne({ owner: userId })
      .populate("owner")
      .populate("savedJobs")
      .populate({
        path: "savedJobs",
      });

    const arr = employeeData.savedJobs.filter((e) => {
      e + "." !== id + ".";
    });
    employeeData.savedJobs = arr;
    employeeData.save();
    res.status(200).json(arr);
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

//@DESC => employees delete notification
//@METHOD => delete
//PATH => /employee/deleteMessage/:userId/:id

export const delteMessages = AsyncHandler(async (req, res) => {
  const { userId, id } = req.params;

  try {
    const user = await Employee.findOne({ owner: userId });
    const message = await Notification.findByIdAndDelete(id);

    const filterdNotification = user.notification.filter((e) => {
      e._id + "*" !== id + "*";
    });

    user.notification = filterdNotification;
    await user.save();
    res.status(201).json({ message: "Notification deleted" });
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});


export const getBankDetails = AsyncHandler(async(req, res)=> {
    
});



export const withDrawBalance = AsyncHandler(async(req, res)=> {

});


export const getMyWithdrawels = AsyncHandler(async(req, res)=> {

});

