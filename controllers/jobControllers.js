import AsyncHandler from "express-async-handler";
import Employer from "../models/employerModel";
import Jobs from "../models/jobModel";
import Proposal from "../models/proposalModel";
import Employee from "../models/employeeModel";
import Admin from "../models/adminModel";

// @DESC employees can post proposal to the job posts
// @METHOD post
// @PATH /proposal/:userId/:id

export const postJobs = AsyncHandler(async (req, res) => {
  const { title, description, budget, deadline, level, searchTag } = req.body;
  const { userId } = req.params;

  try {
    const userData = Employer.findOne(id);
    if (userData) {
      const newJob = new Jobs({
        owner: userId,
        title: title,
        desc: description,
        budget: budget,
        deadline: deadline,
        level: level,
        searchTag: searchTag,
      });
      await userData.contractsPosted.push(newJob._id);
      await userData.save();
      await newJob.save();
      res.status(200).json({
        job: newJob,
        user: userData,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// @DESC employees can see the job posted by them
// @METHOD get
// @PATH /employer/mypost/:userId

export const myJobs = AsyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const keyword = req.query.keyword
      ? {
          owner: userId,
          title: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : { owner: userId };

    const jobs = await Jobs.find(keyword);

    if (jobs) {
      res.status(200).json(jobs);
    } else {
      throw new Error("No jobs found");
    }
  } catch (error) {
    throw new Error("some thing went wrong");
  }
});


// @DESC get the data of all the jobs in the data base
// @METHOD get
// @PATH employer/getAllJobs

export const getAllJobs = AsyncHandler(async( req, res)=> {
    
})





























// @DESC employees can cancel or end job
// @METHOD get
// @PATH /employer/jobstatus/:userId/:id

export const endJob = AsyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const job = Jobs.findById(id);
    job.status = "cancelled";
    await job.save();
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

// @DESC get all data of particular job post
// @METHOD get
// @PATH /employer/jobs/:id

export const jobView = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const jobs = Jobs.findById(id).populate("proposals");

    if (jobs) {
      res.status(201).json(jobs);
    } else {
      res.json("no jobs were found");
    }
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

// @DESC emplyers can approve job once it is finished from th
// @METHOD get
// @PATH employer/jobs/:id
//id=> job id to be approved
//userId => employer id

export const approveJob = AsyncHandler(async (req, res) => {
  const { userId, id } = req.params;

  try {
    const job = await Jobs.findById(id);
    const proposal = await Proposal.findById(job.AcceptedProposals);
    const employer = await Employer.findOne({ owner: userId });
    const employee = await Employee.findOne({ owner: proposal.owner });
    const admin = await Admin.findById("1234568");

    const activeContracts = employee.activeContracts.filter((e) => {
      return e + "*" !== job._id + "*";
    });

    const activeJob = employer.activeContracts.filter((e) => {
      return e + "*" !== job._id + "*";
    });

    const escrow = admin.inEsCrow.filter((e) => {
      return e.proposal + "*" !== Proposal._id + "*";
    });

    const Notifiction = new Notification({
      owner: employee._id,
      message: `congratulations for compleating this job, RS: ${
        proposal.bid - (proposal.bid * 20) / 100
      } have been added to your balance`,
    });

    employee.totalEarned =
      employee.totalEarned + (proposal.bid - (proposal.bid * 20) / 100);

    employee.notification.push(Notifiction._id);

    employee.pendingWithDraw =
      employee.pendingWithDraw + (proposal.bid * 20) / 100;

    //activejobs equel to the active jobs emloyer
    employer.activeJobs = activeJob;
    employer.compleatedJobs.push(job._id);
    employee.activeContracts = activeContracts;

    employer.hires == employer.hires + 1;

    employer.totalSpend = employer.totalSpend + proposal.bid;

    admin.balance = admin.balance + (proposal.bid * 20) / 100;

    admin.inEsCrow = escrow;
    job.status = "compleated";

    await admin.save();
    await employee.save();
    await employer.save();
    await job.save();
    await Notifiction.save();

    res.status({
      message: "success",
    });
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});
