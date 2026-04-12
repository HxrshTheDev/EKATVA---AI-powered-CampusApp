const supabase = require("../config/supabase");

class JobService {
  // Create job listing
  async createJob(jobData, postedBy) {
    const newJob = {
      posted_by: postedBy,
      title: jobData.title,
      company: jobData.company,
      description: jobData.description,
      location: jobData.location,
      job_type: jobData.jobType,
      salary_min: jobData.salaryRange?.min,
      salary_max: jobData.salaryRange?.max,
      required_skills: jobData.requiredSkills || [],
      course: jobData.course,
      year: jobData.year,
      minimum_gpa: jobData.minimumGPA,
    };

    const { data: job, error } = await supabase
      .from("jobs")
      .insert([newJob])
      .select()
      .single();

    if (error) throw error;
    return job;
  }

  // Get all jobs with filters
  async getAllJobs(filters = {}, page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("jobs")
      .select("*, postedBy:users!posted_by(first_name, last_name)", { count: 'exact' })
      .eq("is_active", true);

    if (filters.jobType) query = query.eq("job_type", filters.jobType);
    if (filters.company) query = query.ilike("company", `%${filters.company}%`);
    if (filters.location) query = query.ilike("location", `%${filters.location}%`);
    if (filters.minSalary) query = query.gte("salary_min", filters.minSalary);

    const { data: jobs, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      jobs,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    };
  }

  // Get job by ID
  async getJobById(jobId) {
    const { data: job, error } = await supabase
      .from("jobs")
      .select(`
        *,
        postedBy:users!posted_by(first_name, last_name, email),
        applicants:job_applications(user:users(id, first_name, last_name, email))
      `)
      .eq("id", jobId)
      .single();

    if (error || !job) {
      throw new Error("Job not found");
    }

    return job;
  }

  // Apply for job
  async applyForJob(jobId, userId, applicationData) {
    // 1. Check if job exists
    const { data: job, error: fetchError } = await supabase
      .from("jobs")
      .select("id")
      .eq("id", jobId)
      .single();

    if (fetchError || !job) throw new Error("Job not found");

    // 2. Create application
    const { data: application, error: applyError } = await supabase
      .from("job_applications")
      .insert([{
        job_id: jobId,
        user_id: userId,
        resume_url: applicationData.resumeUrl,
        cover_letter: applicationData.coverLetter
      }])
      .select()
      .single();

    if (applyError) {
      if (applyError.code === '23505') throw new Error("Already applied for this job");
      throw applyError;
    }

    return application;
  }

  // Get user applications
  async getUserApplications(userId, page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: applications, count, error } = await supabase
      .from("job_applications")
      .select("*, job:jobs(title, company, location)", { count: 'exact' })
      .eq("user_id", userId)
      .order('applied_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      applications,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    };
  }

  // Update application status
  async updateApplicationStatus(applicationId, status) {
    const { data: application, error } = await supabase
      .from("job_applications")
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq("id", applicationId)
      .select()
      .single();

    if (error || !application) {
      throw new Error("Application not found");
    }

    return application;
  }

  // Get matching jobs for user
  async getMatchingJobs(userId) {
    // Get user skills and course
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("skills, course, year, gpa")
      .eq("id", userId)
      .single();

    if (userError || !user) throw new Error("User not found");

    // Supabase simplified match
    const { data: matchingJobs, error } = await supabase
      .from("jobs")
      .select("*, postedBy:users!posted_by(first_name, last_name)")
      .eq("is_active", true)
      .or(`course.eq.${user.course},year.eq.${user.year}`)
      .lte("minimum_gpa", user.gpa)
      .limit(10);

    if (error) throw error;
    return matchingJobs;
  }
}

module.exports = new JobService();
