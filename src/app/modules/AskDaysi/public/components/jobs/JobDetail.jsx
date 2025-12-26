import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { gqlQuery, gqlMutate, queryClient } from "@app/_utilities/http";

import {
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Button,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";

import PlaceIcon from "@mui/icons-material/Place";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { GET_JOB_DETAIL, GET_APPLIED_JOBS, APPLY_JOB } from "./queries";


const USER_ID = 10;

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);

  // ---------------------------------------
  // JOB DETAIL QUERY
  // ---------------------------------------
  const { data: jobData, isLoading: jobLoading, isError: jobError } = useQuery({
    queryKey: ["job_detail", id],
    queryFn: ({ signal }) =>
      gqlQuery({
        signal,
        path: "/graphql",
        inData: { gql: GET_JOB_DETAIL(Number(id)) },
      }),
  });

  const job = jobData?.jobId;

  // ---------------------------------------
  // APPLIED JOBS QUERY
  // ---------------------------------------
  const { data: appliedData, isLoading: appliedLoading } = useQuery({
    queryKey: ["applied_jobs", USER_ID],
    queryFn: ({ signal }) =>
      gqlQuery({
        signal,
        path: "/graphql",
        inData: { gql: GET_APPLIED_JOBS(USER_ID) },
      }),
  });
 
  const alreadyApplied = appliedData?.allJobByUser?.rows?.some(
    (j) => String(j.jobId) === String(id)
  );

  // ---------------------------------------
  // APPLY JOB MUTATION
  // ---------------------------------------
  const applyJobMutation = useMutation({
    mutationFn: () =>
      gqlMutate({
        path: "/graphql",
        inData: { gql: APPLY_JOB(Number(id), USER_ID) },
      }),
    onSuccess: (res) => {
      if (res?.applyJob?.success) {
        setOpenAlert(true);
        queryClient.invalidateQueries(["applied_jobs", USER_ID]);
      }
    },
    onError: (err) => {
      alert(err?.message || "Failed to apply for job");
    },
  });

  // ---------------------------------------
  // LOADING / ERROR STATES
  // ---------------------------------------
  if (jobLoading || appliedLoading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }
console.log(!job);
  if (!job) {
    return (
      <Typography color="error" textAlign="center">
        Job details not found.
      </Typography>
    );
  }

  // ---------------------------------------
  // UI
  // ---------------------------------------
  return (
    <Box maxWidth="900px" mx="auto" p={5}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back to Jobs
      </Button>

      <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h3" fontWeight={500}>
          {job.jobTitle}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
          <Chip icon={<PlaceIcon />} label={job.location} />
          <Chip icon={<CurrencyRupeeIcon />} label={`Rs. ${job.salary}`} />
          <Chip icon={<BusinessIcon />} label={`Experience: ${job.experience}`} />
          <Chip icon={<CategoryIcon />} label={job.category} />
        </Box>

        <Typography variant="h5" gutterBottom>
          Job Description
        </Typography>
        <Typography color="text.secondary" mb={3}>
          {job.description}
        </Typography>

        <Typography variant="h5" gutterBottom>
          Qualification
        </Typography>
        <Typography color="text.secondary">{job.qualification}</Typography>

        <Box mt={4}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            disabled={alreadyApplied || applyJobMutation.isLoading}
            onClick={() => applyJobMutation.mutate()}
            sx={{
              py: 1.4,
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 3,
              background: alreadyApplied
                ? "linear-gradient(135deg, #9ca3af, #6b7280)"
                : "linear-gradient(135deg, #f32f08, #f45009)",
            }}
          >
            {applyJobMutation.isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : alreadyApplied ? (
              "Already Applied ✔"
            ) : (
              "Apply for this Job"
            )}
          </Button>
        </Box>

        <Snackbar
          open={openAlert}
          autoHideDuration={3000}
          onClose={() => setOpenAlert(false)}
        >
          <Alert severity="success" variant="filled">
            Application submitted successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}
