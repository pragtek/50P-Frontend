
import { useState, useRef } from "react";
import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { gqlQuery, gqlMutate, queryClient } from "@app/_utilities/http";
import { GET_COURSES, deleteCourse } from "./query";

import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Chip,
  IconButton,
  TextField,
  Pagination,
  CircularProgress,
  Fade,
  Tooltip,
  Paper,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import WorkIcon from "@mui/icons-material/Work";
import PlaceIcon from "@mui/icons-material/Place";
import BusinessIcon from "@mui/icons-material/Business";

export default function JobsList() {
  const navigate = useNavigate();
  const searchInput = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["courses", searchTerm, currentPage],
    queryFn: ({ signal }) =>
      gqlQuery({
        signal,
        path: "/graphql",
        inData: { gql: GET_COURSES(searchTerm, currentPage) },
      }),
    keepPreviousData: true,
  });

  const rows = data?.rows || [];
  const totalRows = data?.totalRows || 0;
  // console.log (data);

  const { mutate: removeJob } = useMutation({
    mutationFn: gqlMutate,
    onSuccess: () => queryClient.invalidateQueries(["courses"]),
  });

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure want to delete this course?")) return;
    removeCourse({ path: "/graphql", inData: { gql: deleteCourse(id) } });
  };

  // return (
  //   <Fade in={true}>
  //     <Box p={3} maxWidth="850px" mx="auto">
        
  //       {/* Search Box */}
  //       <Paper
  //         elevation={6}
  //         sx={{
  //           p: 2,
  //           mb: 4,
  //           borderRadius: 4,
  //           display: "flex",
  //           alignItems: "center",
  //           gap: 2,
  //         }}
  //       >
  //         <SearchIcon sx={{ color: "primary.main", fontSize: 28 }} />
  //         <TextField
  //           inputRef={searchInput}
  //           fullWidth
  //           placeholder="Search job title…"
  //           onChange={(e) => setSearchTerm(e.target.value)}
  //           variant="standard"
  //           InputProps={{ disableUnderline: true }}
  //           sx={{ fontSize: 18 }}
  //         />
  //       </Paper>

  //       {/* Loading */}
  //       {isLoading && (
  //         <Box textAlign="center" mt={5}>
  //           <CircularProgress size={40} />
  //         </Box>
  //       )}

  //       {/* Error */}
  //       {isError && (
  //         <Typography color="error" textAlign="center">
  //           Failed to load jobs.
  //         </Typography>
  //       )}

  //       {/* Job Cards */}
  //       <Box display="flex" flexDirection="column" gap={3}>
  //         {rows.map((r) => (
  //           <Card
  //             key={r.jobId}
  //             elevation={5}
  //             sx={{
  //               borderRadius: 4,
  //               overflow: "hidden",
  //               transition: "0.25s",
  //               "&:hover": {
  //                 transform: "scale(1.015)",
  //                 boxShadow: "0 8px 22px rgba(0,0,0,0.15)",
  //               },
  //             }}
  //           >
  //             <CardActionArea onClick={() => navigate(`/jobs/${r.jobId}`)}>
  //               <CardContent sx={{ p: 3 }}>
  //                 <Box display="flex" justifyContent="space-between" alignItems="center">
  //                   <Typography variant="h6" fontWeight={700}>
  //                     {r.jobTitle}
  //                   </Typography>

  //                   <Tooltip title="Delete Job">
  //                     <IconButton
  //                       onClick={(e) => {
  //                         e.stopPropagation();
  //                         handleDelete(r.jobId);
  //                       }}
  //                     >
  //                       <DeleteIcon color="error" />
  //                     </IconButton>
  //                   </Tooltip>
  //                 </Box>

  //                 {/* Location */}
  //                 <Box display="flex" alignItems="center" mt={1}>
  //                   <PlaceIcon sx={{ color: "secondary.main", mr: 1 }} />
  //                   <Typography color="text.secondary">{r.location}</Typography>
  //                 </Box>

  //                 {/* Employment Type
  //                 <Box mt={2}>
  //                   <Chip
  //                     icon={<WorkIcon />}
  //                     label={job.employmentType}
  //                     color="primary"
  //                     sx={{ fontSize: 14, px: 1.5 }}
  //                   />
  //                 </Box> */}

  //                 {/* Experience */}
  //                 <Box mt={1}>
  //                   <Chip
  //                     icon={<BusinessIcon />}
  //                     label={`Experience: ${r.experience}`}
  //                     color="secondary"
  //                     sx={{ fontSize: 14, px: 1.5 }}
  //                   />
  //                 </Box>

  //               </CardContent>
  //             </CardActionArea>
  //           </Card>
  //         ))}
  //       </Box>

  //       {/* Pagination */}
  //       {totalRows > 0 && (
  //         <Box mt={4} display="flex" justifyContent="center">
  //           <Pagination
  //             color="primary"
  //             shape="rounded"
  //             size="large"
  //             count={Math.ceil(totalRows / 10)}
  //             page={currentPage}
  //             onChange={(e, value) => setCurrentPage(value)}
  //           />
  //         </Box>
  //       )}
  //     </Box>
  //   </Fade>
  // );

return (
  <Fade in={true}>
    <Box p={3} maxWidth="1200px" mx="auto">

      {/* Page Title */}
      <Typography
        textAlign="center"
        variant="h4"
        fontWeight={700}
        mb={4}
        sx={{ color: "#2e2e50" }}
      >
        Courses List
      </Typography>

      {/* Loading */}
      {isLoading && (
        <Box textAlign="center" mt={5}>
          <CircularProgress size={40} />
        </Box>
      )}

      {/* Error */}
      {isError && (
        <Typography color="error" textAlign="center">
          Failed to load courses.
        </Typography>
      )}

      {/* Course Cards Grid */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        gap={4}
        mt={3}
      >
        {rows.map((r) => (
          <Card
            key={r.courseId}
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 5,
              textAlign: "center",
              backgroundColor: "#e7dbff",
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.03)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardContent>
              {/* Course Title */}
              <Typography variant="h6" fontWeight={700} mb={2}>
                {r.courseName}
              </Typography>

              {/* Teacher */}
              <Typography fontSize={15}>
                <strong>Teacher:</strong>
              </Typography>
              <Typography mb={1}>
                {r.firstName} {r.lastName}
              </Typography>

              {/* Level */}
              <Typography fontSize={15}>
                <strong>Duration:</strong>
              </Typography>
              <Typography mb={2}>{r.duration}</Typography>

              {/* View Details Button */}
              <Box mt={3}>
                <button
                  onClick={() => navigate(`/courses/${r.courseId}`)}
                  style={{
                    backgroundColor: "#5a3fd7",
                    padding: "10px 22px",
                    borderRadius: "10px",
                    color: "#fff",
                    border: "none",
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                >
                  View Details
                </button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Pagination */}
      {totalRows > 0 && (
        <Box mt={5} display="flex" justifyContent="center">
          <Pagination
            color="primary"
            shape="rounded"
            size="large"
            count={Math.ceil(totalRows / 10)}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
          />
        </Box>
      )}
    </Box>
  </Fade>
);
}