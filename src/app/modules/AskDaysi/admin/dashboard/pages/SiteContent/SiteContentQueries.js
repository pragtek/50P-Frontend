import { PER_PAGE } from "@app/_utilities/constants/paths";

/* ===========================
   Fetch paginated content
   =========================== */
export const GET_SITE_CONTENT = (search = "", page = 1) => `
  query {
    allContent(
      search: "${search}",
      skip: ${(page - 1) * PER_PAGE},
      first: ${PER_PAGE}
    ) {
      totalRows
      rows {
        id
        title
        content
      }
    }
  }
`;

/* ===========================
   Fetch single content
   =========================== */
export const GET_SITE_CONTENT_BY_ID = (id) => `
  query {
    contentById(id: ${id}) {
      id
      title
      content
    }
  }
`;

/* ===========================
   Create content
   =========================== */
export const CREATE_SITE_CONTENT = (data) => `
  mutation {
    createContent(
      title: "${data.title}",
      content: "${data.content}"
    ) {
      sucuess
      siteContent {
        id
        title
        content
      }
    }
  }
`;

/* ===========================
   Update content
   =========================== */
export const UPDATE_SITE_CONTENT = (data) => `
  mutation {
    updateContent(
      id: ${data.id},
      title: "${data.title}",
      content: "${data.content}"
    ) {
      sucess
      siteContent {
        id
        title
        content
      }
    }
  }
`;

/* ===========================
   Delete content
   =========================== */
export const DELETE_SITE_CONTENT = (id) => `
  mutation {
    deleteContent(id: ${id}) {
      ok
    }
  }
`;
