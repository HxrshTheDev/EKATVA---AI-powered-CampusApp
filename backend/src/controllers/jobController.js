const jobService = require("../services/jobService");
const { sendSuccess, sendError } = require("../utils/responseFormatter");

class JobController {
  // Create job
  async createJob(req, res, next) {
    try {
      const job = await jobService.createJob(req.body, req.user.id);

      sendSuccess(res, job, "Job created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  // Get all jobs
  async getAllJobs(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const filters = {
        jobType: req.query.jobType,
        company: req.query.company,
        location: req.query.location,
        minSalary: req.query.minSalary,
      };

      const result = await jobService.getAllJobs(filters, page, limit);

      sendSuccess(res, result, "Jobs retrieved");
    } catch (error) {
      next(error);
    }
  }

  // Get job by ID
  async getJobById(req, res, next) {
    try {
      const job = await jobService.getJobById(req.params.jobId);

      sendSuccess(res, job, "Job retrieved");
    } catch (error) {
      sendError(res, error.message, 404);
    }
  }

  // Apply for job
  async applyForJob(req, res, next) {
    try {
      const application = await jobService.applyForJob(
        req.params.jobId,
        req.user.id,
        req.body,
      );

      sendSuccess(res, application, "Application submitted", 201);
    } catch (error) {
      sendError(res, error.message, 400);
    }
  }

  // Get user applications
  async getUserApplications(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await jobService.getUserApplications(
        req.user.id,
        page,
        limit,
      );

      sendSuccess(res, result, "Applications retrieved");
    } catch (error) {
      next(error);
    }
  }

  // Get matching jobs
  async getMatchingJobs(req, res, next) {
    try {
      const jobs = await jobService.getMatchingJobs(req.user.id);

      sendSuccess(res, jobs, "Matching jobs retrieved");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new JobController();
