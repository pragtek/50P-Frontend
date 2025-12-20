// ---------------------------------------------
// GET JOBS QUERY (backend = all_job_list)
// ---------------------------------------------

export const GET_JOBS = (searchTerm = "", page = 1) => {
  const skip = (page - 1) * 10;

  return `
    query {
      allJobList(search: "${searchTerm}", skip: ${skip}, first: 10) {
        rows {
          jobId
          jobTitle
          description
          qualification
          location
          salary
          
          category
          experience
        }
        totalRows
      }
    }
  `;
};
export const GET_JOB_DETAIL = (id) => `
  query {
    allJobList(search: "", skip: 0, first: 100) {
      rows {
        jobId
        jobTitle
        description
        qualification
        location
        salary
        category
        experience
      }
    }
  }
`;
// --------------------------------------------
// APPLY JOB
// ---------------------------------------------
export const APPLY_JOB = `
  mutation ApplyJob($jobId: Int!) {
    applyJob(jobId: $jobId) {
      ok
      message
    }
  }
`;


// ---------------------------------------------
// DELETE JOB 
// ---------------------------------------------
export const deleteJob = (id) => `
  mutation {
    deleteJob(jobId: ${id}) {
      ok
    }
  }
`;

// ---------------------------------------------
// CREATE JOB 
// ---------------------------------------------
export const createJob = (input) => `
  mutation {
    createJob(
      input: {
        job_title: "${input.jobTitle}"
        description: "${input.description}"
        qualification: "${input.qualification}"
        location: "${input.location}"
        salary: "${input.salary}"
      
        category: "${input.category}"
        experience: "${input.experience}"
      }
    ) {
      jobId
    }
  }
`;

// ---------------------------------------------
// UPDATE JOB
// ---------------------------------------------
export const updateJob = (id, input) => `
  mutation {
    updateJob(
      jobId: ${id}
      input: {
        job_title: "${input.jobTitle}"
        description: "${input.description}"
        qualification: "${input.qualification}"
        location: "${input.location}"
        salary: "${input.salary}"
        
        category: "${input.category}"
        experience: "${input.experience}"
      }
    ) {
      jobId
    }
  }
`;
