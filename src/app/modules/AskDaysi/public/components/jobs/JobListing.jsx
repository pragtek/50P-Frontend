import { useState, useRef } from "react";
import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { gqlQuery, gqlMutate, queryClient } from "@app/_utilities/http";
import { GET_JOBS, deleteJob } from "./queries";

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
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import WorkIcon from "@mui/icons-material/Work";
import PlaceIcon from "@mui/icons-material/Place";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import BusinessIcon from "@mui/icons-material/Business";

export default function JobsList() {
  const navigate = useNavigate();
  const searchInput = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["jobs", searchTerm, currentPage],
    queryFn: ({ signal }) =>
      gqlQuery({
        signal,
        path: "/graphql",
        inData: { gql: GET_JOBS(searchTerm, currentPage) },
      }),
    keepPreviousData: true,
  });

  const rows = data?.rows || [];
  const totalRows = data?.totalRows || 0;
  // console.log (data);

  const { mutate: removeJob } = useMutation({
    mutationFn: gqlMutate,
    onSuccess: () => queryClient.invalidateQueries(["jobs"]),
  });

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure want to delete this job?")) return;
    removeJob({ path: "/graphql", inData: { gql: deleteJob(id) } });
  };

  return (
    <Fade in={true}>
      <Box p={1} maxWidth="850px" mx="auto">
        
        {/* Search Box */}
        <Paper
          elevation={5}
          sx={{
            p: 1.5,
            mb: 4,
            borderRadius: 5,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <SearchIcon sx={{ color: "primary.main", fontSize: 28 }} />
          <TextField
            inputRef={searchInput}
            fullWidth
            placeholder="Search job title…"
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="standard"
            InputProps={{ disableUnderline: true }}
            sx={{ fontSize: 18 }}
          />
        </Paper>

        {/* Loading */}
        {isLoading && (
          <Box textAlign="center" mt={5}>
            <CircularProgress size={40} />
          </Box>
        )}

        {/* Error */}
        {isError && (
          <Typography color="error" textAlign="center">
            Failed to load jobs.
          </Typography>
        )}

        {/* Job Cards */}
        <Box display="flex" flexDirection="column" gap={3}>
          {rows.map((r) => (
            <Card
              key={r.jobId}
              elevation={5}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                transition: "0.2s",
                // "&:hover": {
                //   transform: "scale(1.015)",
                //   boxShadow: "0 8px 22px rgba(0,0,0,0.15)",
                // },
              }}
            >
              {/* <CardActionArea onClick={() => navigate(`/jobs/${r.jobId}`)}> */}
              <CardActionArea onClick={() => navigate(`/askdaysi/jobs/${r.jobId}`)}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h3" fontWeight={400}>
                      {r.jobTitle}
                    </Typography>

                    {/* <Tooltip title="Delete Job">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(r.jobId);
                        }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip> */}
                  </Box>

                  {/* Location */}
                  <Box display="flex" alignItems="center" mt={1}>
                    <PlaceIcon sx={{ color: "secondary.main", mr: 1 }} />
                    <Typography color="text.secondary">{r.location}</Typography>
                  </Box>

                   {/* salary */}
                  <Box display="flex" alignItems="center" mt={1}>
                  <CurrencyRupeeIcon sx={{ color: "secondary.main", mr: 1 }} />
                  <Typography color="text.secondary">{r.salary}</Typography>
                  </Box>

                  {/* Experience */}
                  <Box mt={1}>
                    <Chip
                      icon={<BusinessIcon />}
                      label={`Experience: ${r.experience}`}
                      color="secondary"
                      sx={{ fontSize: 15, px: 1 }}
                    />
                  </Box>
                  
                    {/* View Details Button */}
                    <Box mt={2} textAlign="right">
                      <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/askdaysi/jobs/${r.jobId}`);
                      }}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        px: 2.5,
                        fontWeight: 500,
                        color: "#fff",
                        background: "linear-gradient(135deg, #e1420dff, #f45f09ff)",
                      
                        "&:hover": {
                          background: "linear-gradient(135deg, #4338ca, #2563eb)",
                          
                        },
                      }}
                    >
                      View Details
                    </Button>

                    </Box>

                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>

        {/* Pagination */}
        {totalRows > 0 && (
          <Box mt={4} display="flex" justifyContent="center">
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
