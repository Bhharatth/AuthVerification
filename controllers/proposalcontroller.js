import AsyncHandler from "express-async-handler";
import Employee from "../models/employeeModel";
import Jobs from "../models/jobModel";
import Admin from "../models/adminModel.js";
import Employer from "../models/employerModel";
import Proposal from "../models/proposalModel";
import Notification from "../models/notificationModel";
import { connect } from "mongoose";

//@DESC => EMPLOYEES CAN POST POROPOSAL TO THE JOB POSTS
//@METHODE => POST
//@PATH => /proposal/:userId/:id
//id => jobId

export const submitProposals = AsyncHandler(async (req, res) => {
  const { credit, cover, bid, deadline } = req.body;
  const { userId, id } = req.params;

  try {
    const employee = await Employee.findOne({ owner: userId });
    const job = await Jobs.findOne({ _id: id, status: "active" });
    const employer = await Employer.findOne({ owner: job.owner });

    if (job && employer) {
      const newProposal = new Proposal({
        owner: userId,
        jobs: id,
        cover: cover,
        bid: bid,
        deadline: deadline,
      });

      const newNotification = new Notification({
        owner: employer._id,
        message: `A new protfolio request for your job contract: ${job.title}`,
      });
      await newProposal.save();

      employee.connects = employee.connects - credit;
      employer.notification.push(newNotification._id);
      job.proposals.push(newNotification._id);

      await newNotification.save();
      await newProposal.save();
      await employee.save();
      await job.save();
      await employer.save();

      res.status(200).json({
        proposal: newProposal,
        jobs: job,
        employees: employee,
      });
    } else {
      throw new Error("no user found");
    }
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

//@DESC => USERS CAN VIEW THE DETAILS IN THE PROPOSAL
//@//METHOD => GET
//@PATH => /viewProposal/:id
//id => proposal id

export const viewProposal = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const proposal = await Proposal.find(id);
    if (proposal) {
      res.status(200).json(proposal);
    } else {
      res.json("No proposals found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

//@DESC => EMPLOYERS CAN SHORTLIST OR REJECT EMPLOYEES
//@//METHOD => POST
//@PATH => /updateProposal/:userId/:id
//id => proposal id

export const updateProposal = AsyncHandler(async (req, res) => {
  const { id, userId } = req.params;
  const { status } = req.body;

  try {
    const proposal = await Proposal.find(id);
    const employee = await Employee.findOne({ owner: proposal?.owner });
    proposal.status = status;

    if (proposal) {
      if (status === "shortlisted") {
        const newNotification = new Notification({
          owner: employee._id,
          message: "Your proposal is shortListed, You earned 5 credits",
        });
        employee.connects = employee.connects + 5;
        employee.notification.push(newNotification._id);
        await employee.save();
        await newNotification.save();
        res.status(200).send(newNotification);
      } else {
        const newNotification = new Notification({
          owner: employee?._id,
          message: "Your proposal is rejected",
        });
        employee.notification.push(newNotification._id);
        await employee.save();
        await newNotification.save();
      }
      await proposal.save();
    }
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

//@DESC => EMPLOYEES CAN SEE THE PROPOSALS POSTED BY THEM
//@METHODE => GET
//@PATH => /myProposal/:userId/:id

export const myProposals = AsyncHandler(async (req, res) => {
  try {
    const { userId, id } = req.params;
    const pageSize = 4;
    const { page } = Number(req.query.pageNumber) || 1;

    const count = await Proposal.count({ owner: userId });
    const proposals = await Proposal.find({ owner: userId }).limit(pageSize);

    if (proposals) {
      res
        .status(200)
        .json({ proposals, page, pages: Math.ceil(count / pageSize) });
    } else {
      throw new Error("no proposals found");
    }
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

//@DESC => EMPLOYERS CAN ACCEPT THE PROPOSAL AND START THE CONTRACT
//@METHODE => POST
//@PATH => //acceptProposal/:userId/:id
//id=> proposal id

export const acceptProposal = AsyncHandler(async (req, res) => {
  const { id, userId } = req.params;
  const { totalamount } = req.body;

  try {
    const proposal = await Proposal.findById(id);
    const employee = await Employee.findOne({
      owner: proposal?.owner,
    }).populate("owner");
    const employer = await Employer.findOne({ owner: userId });
    const job = await Jobs.findById(proposal.jobs);
    const admin = await Admin.findById("5555555");

    if (proposal && employee && employee && job && admin) {
      if (employer.balance >= totalamount) {
        const newNotification = new Notification({
          owner: employee._id,
          message: "Your proposal accepted Please start Your work",
        });
        employer.balance = employer.balance - totalamount;

        admin.inEsCrow.push({
          employee: employee.owner._id,
          employer: employer.owner,
          proposal: proposal._id,
          inEscrow: totalamount,
        });

        employee.activeContracts.push(job._id);
        employer.activeJobs.push(job._id);
        job.status = " running";
        job.AcceptedProposals = proposal._id;
        employee.notification.push(newNotification._id);

        await employee.save();
        await employer.save();
        await admin.save();
        await job.save();
        await newNotification.save();

        sendMail({
          to: employee.owner.email,
          from: "admin@gmial.com",
          subject: "WORK PROPOSAL",
          HTML: `
            <div>
            <h1>PROPOSAL ACCEPTED</h1>
            <P>Congratulations your proposal hasbeen accepted , please contact your employer</P>
            </div>`,
        });

        res.status(200).json({ message: "success" });
      } else {
        throw new Error(error);
      }
    }
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});
