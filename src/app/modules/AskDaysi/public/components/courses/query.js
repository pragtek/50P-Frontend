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
// DELETE COURSE
// ---------------------------------------------
export const deleteCourse = (id) => `
  mutation {
    deleteCourse(courseId: ${id}) {
      ok
    }
  }
`;

// ---------------------------------------------
// CREATE COURSE
// ---------------------------------------------
export const createCourse = (input) => `
  mutation {
    createCourse(
      input: {
        courseName: "${input.courseName}"
        duration: "${input.duration}"
        teacherId: ${input.teacherId}
      }
    ) {
      courseId
    }
  }
`;

// ---------------------------------------------
// UPDATE COURSE
// ---------------------------------------------
export const updateCourse = (id, input) => `
  mutation {
    updateCourse(
      courseId: ${id}
      input: {
        courseName: "${input.courseName}"
        duration: "${input.duration}"
        teacherId: ${input.teacherId}
      }
    ) {
      courseId
    }
  }
`;
