
import { useState, useRef } from "react";
import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { gqlQuery, gqlMutate, queryClient } from "@app/_utilities/http";
import { GET_COURSES, deleteCourse } from "./query";

import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Pagination,
  CircularProgress,
  Fade,
  Tooltip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function CourseList() {
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

  const { mutate: removeCourse } = useMutation({
    mutationFn: gqlMutate,
    onSuccess: () => {
      queryClient.invalidateQueries(["courses"]);
    },
  });

  
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure want to delete this course?")) return;
    removeCourse({
      path: "/graphql",
      inData: { gql: deleteCourse(id) },
    });
  };
  

  return (
    <Fade in={true}>
      <Box p={3} maxWidth="1200px" mx="auto">

        

        <Box display="flex" justifyContent="center" mb={3}>
          <TextField
            inputRef={searchInput}
            variant="outlined"
            placeholder="Search courses..."
            size="small"
            sx={{
              // width: "px",
              background: "#ffffff",
              borderRadius: 2,
              boxShadow: "0px 3px 10px rgba(0,0,0,0.15)",
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: <SearchIcon sx={{ opacity: 0.7 }} />,
            }}
          />
        </Box>

        {isLoading && (
          <Box textAlign="center" mt={5}>
            <CircularProgress size={40} />
          </Box>
        )}

        {isError && (
          <Typography color="error" textAlign="center">
            Failed to load courses.
          </Typography>
        )}

        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(320px, 1fr))"
          gap={4}
          mt={3}
        >
          {rows.map((r) => (
            <Card
              key={r.courseId}
              elevation={4}
              sx={{
                p: 1,
                borderRadius: 4,
                backgroundColor: "#EBF6FF",
                border: "1px solid #CDE9FF",
                transition: "0.25s ease",
                
              }}
            >
              <CardContent>

                <Box display="flex" alignItems="center" mb={2}>
                  <SchoolIcon sx={{ color: "#78092cff", mr: 1 }} />
                  <Typography
                    variant="h4"
                    fontWeight={500}
                    sx={{ color: "#0c0d0dff" }}
                  >
                    {r.courseName}
                  </Typography>
                </Box>

                
                <Box display="flex" alignItems="center" mb={2}>
                  <PersonIcon sx={{ color: "#161717ff", mr: 1 }} />
                  <Typography fontSize={15} sx={{ color: "#101010ff" }}>
                    {r.teacher?.firstName} {r.teacher?.lastName}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <AccessTimeIcon sx={{ color: "#0e0e0fff", mr: 1 }} />
                  <Typography fontSize={15} sx={{ color: "#0a0a0aff" }}>
                    {r.duration}
                  </Typography>
                </Box>

                <Box mt={3} textAlign="right">
                  <Tooltip title="deleteCourse">
                    <IconButton
              
                      onClick={() => handleDelete(r.courseId)} 
                      sx={{
                        color: "#ebdfdfff",
                        backgroundColor: "#d63031",
                        width: 42,
                        height: 42,
                        borderRadius: "12px",
                        "&:hover": { backgroundColor: "#b71c1c" },
                        boxShadow: "0px 4px 12px rgba(0,0,0,0.25)",
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  
                </Box>

              </CardContent>
            </Card>
          ))}
        </Box>

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
