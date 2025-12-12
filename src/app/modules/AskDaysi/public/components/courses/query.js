
// ---------------------------------------------
// GET COURSES QUERY (with search & pagination)
// ---------------------------------------------
export const GET_COURSES = (searchTerm = "", page = 1) => {
  const skip = (page - 1) * 10;

  return `
    query {
      allCourses(search: "${searchTerm}", skip: ${skip}, first: 10) {
        rows {
          courseId
          courseName
          duration
          teacher {
            firstName
            lastName
          }
        }
        totalRows
      }
    }
  `;
};



// ---------------------------------------------
// CREATE COURSE  (UPDATED: includes firstName, lastName)
// ---------------------------------------------
export const createCourse = (input) => `
  mutation {
    createCourse(
      input: {
        courseName: "${input.courseName}"
        duration: "${input.duration}"
        teacher: {
          firstName: "${input.firstName}"
          lastName: "${input.lastName}"
        }
      }
    ) {
      courseId
    }
  }
`;

// ---------------------------------------------
// UPDATE COURSE (UPDATED: includes teacher firstName + lastName)
// ---------------------------------------------
export const updateCourse = (id, input) => `
  mutation {
    updateCourse(
      courseId: ${id}
      input: {
        courseName: "${input.courseName}"
        duration: "${input.duration}"
        teacher: {
          firstName: "${input.firstName}"
          lastName: "${input.lastName}"
        }
      }
    ) {
      courseId
    }
  }
`;
// ---------------------------------------------
// DELETE COURSE
// ---------------------------------------------
export const deleteCourse = (id) => `
  mutation {
    deleteCourse(id: ${id}) {
      ok
    }
  }
`