import { PER_PAGE } from "@app/_utilities/constants/paths";

export const GET_JOBS = (search = "", page = 1) => `
query {
  allJobs(
    search: "${search}"
    skip: ${(page - 1) * PER_PAGE}
    first: ${PER_PAGE}
  ) {
    totalRows
    rows {
      jobId
      jobTitle
      description
      qualification
      location
      address
      latitude
      longitude
      salary
      employmentType
      category
      experience
    }
  }
}
`;

export const GET_JOB = (id) => `
query {
  JobById(jobId: ${id}) {
    jobId
    jobTitle
    description
    qualification
    location
    address
    latitude
    longitude
    salary
    employmentType
    category
    experience
  }
}
`;

export const createJob = (data) => `
mutation {
  createJob(
    jobTitle: "${data.jobTitle}",
    description: "${data.description}",
    qualification: "${data.qualification}",
    location: "${data.location}",
    salary: "${data.salary}",
    employmentType: "${data.employmentType}",
    category: "${data.category}",
    experience: "${data.experience}",
    address: "${data.address}",
    latitude: "${data.latitude}",
    longitude: "${data.longitude}"
  ) {
    job {
      jobId
    }
  }
}
`;

export const updateJob = (data) => `
mutation {
  updateJob(
    jobId: ${data.jobId},
    jobTitle: "${data.jobTitle}",
    description: "${data.description}",
    qualification: "${data.qualification}",
    location: "${data.location}",
    salary: "${data.salary}",
    employmentType: "${data.employmentType}",
    category: "${data.category}",
    experience: "${data.experience}",
    address: "${data.address}",
    latitude: "${data.latitude}",
    longitude: "${data.longitude}"
  ) {
    job {
      jobId
    }
  }
}
`;

export const deleteJob = (id) => `
mutation {
  deleteJob(jobId: ${id}) {
    ok
  }
}
`;
